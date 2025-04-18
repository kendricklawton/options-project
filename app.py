import gevent
import gevent.monkey

gevent.monkey.patch_all()
import logging
import os
import pandas as pd

pd.set_option("future.no_silent_downcasting", True)
import pytz
import signal
import sys
import traceback
import yfinance as yf
from cachetools import TTLCache, cached
from collections import defaultdict
from datetime import date, datetime, timedelta
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit


# Initialize Flask application
app = Flask(__name__)


# Load environment variables
load_dotenv()


# Environment variables
site_url_one = os.getenv("SITE_URL_ONE")
site_url_two = os.getenv("SITE_URL_TWO")
site_url_three = os.getenv("SITE_URL_THREE")


# Enable CORS
CORS(
    app, origins=[site_url_one, site_url_two, site_url_three], supports_credentials=True
)


# Initialize SocketIO with gevent async_mode
socketio = SocketIO(
    app,
    cors_allowed_origins=[site_url_one, site_url_two, site_url_three],
    async_mode="gevent",
)


user_tasks = defaultdict(dict)  # Store user tasks for each sid
user_activity = defaultdict(datetime.now)  # Store last activity time for each sid

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set the logging level
    format="%(asctime)s - %(levelname)s - %(message)s",  # Log format with timestamps
    handlers=[logging.StreamHandler(sys.stdout)],  # Log to stdout for Cloud Run
)


# Cache setup: TTLCache with a time-to-live (TTL) of 30 seconds for stock and index data
cache = TTLCache(maxsize=100, ttl=30)


# Stock market holidays for 2025
MARKET_HOLIDAYS = [
    date(2025, 1, 1), ## New Year's Day
    date(2025, 7, 4), ## Independence Day
    date(2025, 4, 18), ## Good Friday
    date(2025, 9, 1), ## Labor Day
    date(2025, 11, 27), ## Thanksgiving Day
    date(2025, 12, 25), ## Christmas Day
]


# Get the current eastern timezone
eastern = pytz.timezone("America/New_York")


# Maximum idle time (e.g., 5 minutes)
MAX_IDLE_TIME = timedelta(minutes=4)


# Function to check if the market is open
def is_market_open():
    if date.today() in MARKET_HOLIDAYS:
        return False
    """Returns True if the market is open, otherwise False."""
    now_et = (
        datetime.now(pytz.utc).astimezone(eastern).time()
    )  # Convert to Eastern Time

    market_open_time = datetime.strptime("09:30", "%H:%M").time()  # 9:30 AM ET
    market_close_time = datetime.strptime("16:00", "%H:%M").time()  # 4:00 PM ET
    return market_open_time <= now_et < market_close_time


# Function to check if today is a market holiday
def time_until_market_open():
    """Returns the time (in seconds) until the market opens, accounting for timezone differences."""
    now_utc = datetime.now(pytz.utc)  # Get current time in UTC
    now_et = now_utc.astimezone(eastern)  # Convert to Eastern Time

    # Define today's market open time in ET
    market_open_time = eastern.localize(
        datetime(now_et.year, now_et.month, now_et.day, 9, 30)
    )

    # If it's already past market open today, set to next day's open time
    if now_et.time() >= market_open_time.time():
        market_open_time += timedelta(days=1)

    return (market_open_time - now_et).total_seconds()


# Function to check if today is a market holiday
def close_market_tasks():
    """Clears all market tasks and subscriptions."""
    logging.info("Clearing all market tasks...")
    user_tasks.clear()  # Clear all user tasks
    user_activity.clear()  # Clear all user activity
    logging.info("All market tasks have been cleared.")


# Caching the retrieval of stock data
@cached(cache)
def get_stock_data(symbol):
    """Fetch stock data and option chain for the given symbol."""
    try:
        stock = yf.Ticker(symbol.strip().lower())
        info = stock.info
        dates = []
        news = stock.news
        option_chain = {}

        if stock.options:
            dates = list(stock.options)

        if dates == []:
            return info, option_chain, news

        # Fetch option chain for each expiration date
        for date in dates:
            try:
                chain = stock.option_chain(date)
            except Exception as e:
                chain = None
                logging.error(
                    f"Error fetching option chain for {symbol} on {date}: {e}. Function: get_stock_data. Second try catch in get_stock_data."
                )
                continue

            # Check if the chain is not None
            if chain != None:
                # Calculate the mark price for calls and puts
                chain.calls["mark"] = (chain.calls["bid"] + chain.calls["ask"]) / 2
                chain.puts["mark"] = (chain.puts["bid"] + chain.puts["ask"]) / 2

                calls = chain.calls.fillna(value=0)
                puts = chain.puts.fillna(value=0)

                # Drop duplicate strikes
                all_strikes = pd.concat(
                    [calls[["strike"]], puts[["strike"]]]
                ).drop_duplicates()

                calls = all_strikes.merge(calls, on="strike", how="outer").fillna(0)

                puts = all_strikes.merge(puts, on="strike", how="outer").fillna(0)

                calls = calls.drop(columns=["lastTradeDate"], errors="ignore")
                puts = puts.drop(columns=["lastTradeDate"], errors="ignore")

                # Strike prices
                strikes = calls["strike"].tolist()

                # Option chain data, using date as the key
                option_chain[date] = {
                    "calls": calls.to_dict(orient="records"),
                    "strikes": strikes,
                    "puts": puts.to_dict(orient="records"),
                }

        return info, option_chain, news
    except Exception as e:
        logging.error(
            f"Error getting stock data for {symbol}: {e}. Function: get_stock_data"
        )
        raise


# Function to drop idle connections
def drop_idle_connections():
    """Drop idle WebSocket connections."""
    logging.info("Starting idle connection cleanup...")
    while True:
        logging.info("Checking for idle connections...")
        now = datetime.now()
        if is_market_open():
            for sid, last_time in list(user_activity.items()):
                if now - last_time > MAX_IDLE_TIME:
                    logging.info(f"Disconnecting idle client: {sid}")
                    socketio.emit(
                        "message",
                        {"message": "Idle connection closed"},
                        to=sid,
                        namespace="/stock",
                    )

                    user_activity.pop(sid, None)  # Remove from last_activity
                    user_tasks.pop(sid, None)  # Remove from user_tasks
            gevent.sleep(60)  # Check every 60 seconds
        else:
            logging.info(
                "drop_idle_connections - Market is closed. Stopping idle connection cleanup..."
            )
            # Wait until the market opens
            while not is_market_open():
                time_until_open = time_until_market_open()
                minutes_until_open = int(time_until_open // 60)
                seconds_until_open = int(time_until_open % 60)
                logging.info(
                    f"drop_idle_connections - Market is closed. It will reopen in {minutes_until_open} minutes and {seconds_until_open} seconds."
                )
                # Clear all user tasks and subscriptions
                user_tasks.clear()
                user_activity.clear()

                # Sleep until the market opens
                gevent.sleep(time_until_open)
            logging.info(
                "drop_idle_connections - Market is open. Resuming idle connection cleanup..."
            )
            gevent.sleep(60)  # Wait 60 seconds before the next iteration


# Function to broadcast stock data to all connected clients
def broadcast_stock_data():
    """Broadcast stock data to all connected clients."""
    logging.info("Starting stock data broadcasting...")
    try:
        while True:
            logging.info("Broadcasting stock data...")
            if is_market_open():
                for sid, task_data in list(
                    user_tasks.items()
                ):  # Use a copy of the items
                    logging.info(f"Broadcasting stock data to {sid}")
                    symbols = task_data.get("symbols", [])

                    data = {}
                    info = {}
                    option_chain = {}
                    news = {}
                    try:
                        for symbol in symbols[:]:  # Use a copy of the symbols list
                            try:
                                info, option_chain, news = get_stock_data(symbol)
                                data[symbol] = {
                                    "info": info,
                                    "option_chain": option_chain,
                                    "news": news,
                                }
                            except Exception as e:
                                # Remove the symbol from the user's subscription list
                                user_tasks[sid]["symbols"].remove(symbol)
                                logging.error(
                                    f"Error processing stock data for {symbol}: {e}. Function: broadcast_stock_data"
                                )
                                continue

                        # Emit the stock data to the client
                        socketio.emit(
                            "data",
                            {"data": data},
                            namespace="/stock",
                            to=sid,
                        )
                    except Exception as e:
                        # Remove the sid from user_tasks if an error occurs
                        logging.error(
                            f"Error broadcasting data to {sid}: {e}. Removing sid from user_tasks."
                        )
                        user_tasks.pop(sid, None)
                        user_activity.pop(sid, None)
            else:
                logging.info(
                    "broadcast_stock_data - Market is closed. Stopping stock broadcasting..."
                )
                # Wait until the market opens
                while not is_market_open():
                    time_until_open = time_until_market_open()
                    minutes_until_open = int(time_until_open // 60)
                    seconds_until_open = int(time_until_open % 60)
                    logging.info(
                        f"broadcast_stock_data - Market is closed. It will reopen in {minutes_until_open} minutes and {seconds_until_open} seconds."
                    )

                    # Clear all user tasks and subscriptions
                    user_tasks.clear()
                    user_activity.clear()

                    # Sleep until the market opens
                    gevent.sleep(time_until_open)  # Wait until the market opens
                logging.info(
                    "broadcast_stock_data - Market is open. Resuming stock broadcasting..."
                )
            gevent.sleep(60)
    except Exception as e:
        logging.error(f"Error in broadcast_stock_data: {str(e)}")


# Start shared threads
gevent.spawn(broadcast_stock_data)
gevent.spawn(drop_idle_connections)


# Middleware to check the Origin header
@app.before_request
def before_request():
    """Check the Origin header for CORS."""
    # Get the Origin header from the request
    origin = request.headers.get("Origin")
    logging.info(f"Origin: {origin}")
    # Check if the Origin header is present and matches the allowed origins
    if origin not in [site_url_one, site_url_two, site_url_three]:
        logging.warning(f"Invalid Origin: {origin}")
        return jsonify({"error": "Invalid Origin"}), 403


# Route for home
@app.route("/", methods=["GET"])
def home():
    """Home route."""
    return "Options Project"


# REST Route for Stock Data
@app.route("/stock-data", methods=["GET"])
def fetch_stock_data():
    """Handle GET request for stock data."""
    try:
        symbols = request.args.getlist("symbols[]")
        if not symbols:
            return jsonify({"error": "Symbol is required"}), 400

        data = {}
        info = {}
        option_chain = {}
        news = {}
        for symbol in symbols:
            info, option_chain, news = get_stock_data(symbol)
            data[symbol] = {"info": info, "option_chain": option_chain, "news": news}

        return jsonify(data), 200
    except Exception as e:
        logging.error(
            f"Error fetching stock data for {symbols}: {e}. Function: fetch_stock_data"
        )
        return jsonify({"error": str(e)}), 500


# WebSocket Stock Data Subscription
@socketio.on("subscribe", namespace="/stock")
def stock_subscribe(data):
    """Handle WebSocket subscription for stock data."""
    try:
        sid = request.sid
        user_activity[sid] = datetime.now()  # Update last activity timestamp

        symbols = data.get("symbols")
        if not symbols:
            emit(
                "error",
                {"error": "Symbol is required"},
                to=sid,
                namespace="/stock",
            )
            return

        indexes = ["^VIX", "^GSPC", "^DJI", "^IXIC", "^RUI", "^RUT", "^RUA"]

        # Remove previous symbol subscription minus the indexes
        # This will remove any symbols that are not in the indexes list
        # and keep the indexes in the user's subscription list
        user_tasks[sid]["symbols"] = [
            symbol
            for symbol in user_tasks.setdefault(sid, {}).setdefault("symbols", [])
            if symbol in indexes
        ]

        # Add new symbols to the user's subscription list
        # This will add the new symbols to the user's subscription list
        # and keep the indexes in the user's subscription list
        for symbol in symbols:
            if symbol not in user_tasks.setdefault(sid, {}).setdefault("symbols", []):
                user_tasks[sid]["symbols"].append(symbol)
        emit(
            "message",
            {"message": f"{sid} subscribed to {symbols}"},
            to=sid,
            namespace="/stock",
        )
    except Exception as e:
        logging.error(f"Error in stock subscribe: {str(e)}")
        emit(
            "error",
            {"error": f"Error in subscribe: {str(e)}"},
            to=sid,
            namespace="/stock",
        )


# WebSocket Stock Data Unsubscription
@socketio.on("unsubscribe", namespace="/stock")
def stock_unsubscribe(data):
    """Handle WebSocket unsubscription for stock data."""
    try:
        sid = request.sid
        logging.info(f"Unsubscribing {sid} from stock data")
        if sid in user_tasks:
            # Remove the sid from user_tasks
            del user_tasks[sid]
            # Remove the sid from user_activity
            del user_activity[sid]
            emit(
                "message",
                {"message": f"{sid} unsubscribed"},
                to=sid,
                namespace="/stock",
            )
            logging.info(f"Unsubscribed {sid} from stock data")
        else:
            logging.warning(f"Unsubscribe request for unknown sid: {sid}")
    except Exception as e:
        logging.error(f"Error in stock unsubscribe: {str(e)}")
        emit(
            "error",
            {"error": f"Error in unsubscribe: {str(e)}"},
            to=sid,
            namespace="/stock",
        )


def handle_shutdown(signal_number, frame):
    """Handle shutdown signal."""
    logging.info(f"Received shutdown signal: {signal_number}")
    logging.info("Stack trace at the time of shutdown:")
    # Log the stack trace for debugging purposes
    stack_trace = "".join(traceback.format_stack(frame))
    logging.debug(f"Stack trace:\n{stack_trace}")

    close_market_tasks()  # Call your cleanup function
    logging.info("Server shutdown complete.")
    sys.exit(0)


signal.signal(signal.SIGINT, handle_shutdown)
signal.signal(signal.SIGTERM, handle_shutdown)


if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8080)),
        debug=True,
        use_reloader=False,
    )
