import gevent
import gevent.monkey

gevent.monkey.patch_all()

import logging
import os
import pandas as pd
import pytz
import signal
import sys
import traceback
import yfinance as yf
from cachetools import TTLCache, cached
from collections import defaultdict
from datetime import date, datetime
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

# Enable CORS for all origins
CORS(app, origins=[site_url_one, site_url_two, site_url_three])

# Initialize SocketIO with gevent async_mode
socketio = SocketIO(
    app,
    cors_allowed_origins=[site_url_one, site_url_two, site_url_three],
    async_mode="gevent",
)

# Use a dictionary to store the symbol for each sid
user_tasks = defaultdict(dict)

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # Set the logging level
    format="%(asctime)s - %(levelname)s - %(message)s",  # Log format with timestamps
    handlers=[
        logging.StreamHandler(sys.stdout),  # Log to stdout for Cloud Run
    ],
)

# Cache setup: TTLCache with a time-to-live (TTL) of 60 seconds for stock and index data
cache = TTLCache(maxsize=100, ttl=60)

# Stock market holidays for 2025
MARKET_HOLIDAYS = [
    date(2025, 1, 1),
    date(2025, 7, 4),
    date(2025, 11, 27),
    date(2025, 12, 25),
]


# return market_open <= now <= market_close
def is_market_open():
    return False  # Always return True for testing


def close_market_tasks():
    # Clear all subscriptions for indexes and stock
    user_tasks["indexes"].clear()  # Clear all index subscriptions
    user_tasks["stock"].clear()  # Clear all stock subscriptions
    logging.info("All market tasks have been cleared.")


# Caching the retrieval of stock data
@cached(cache)
def get_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol.strip().lower())
        stock_info = stock.info
        dates = list(stock.options)
        option_chain = {}

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

                # Fill NaN values with 0
                calls = chain.calls.fillna(value=0)
                puts = chain.puts.fillna(value=0)

                # Drop duplicate strikes
                all_strikes = pd.concat(
                    [calls[["strike"]], puts[["strike"]]]
                ).drop_duplicates()

                # Merge the strikes with calls and puts
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

        return stock_info, option_chain
    except Exception as e:
        logging.error(
            f"Error fetching stock data for {symbol}: {e}. Function: get_stock_data"
        )


# Caching the retrieval of index data
@cached(cache)
def get_index_data(symbol):
    try:
        index = yf.Ticker(symbol.strip().lower())
        return index.info
    except Exception as e:
        logging.error(
            f"Error fetching index data for {symbol}: {e}. Function: get_index_data"
        )
        return {"error": f"Failed to fetch data for {symbol}"}


def broadcast_indexes_data():
    try:
        while True:
            if is_market_open():
                logging.info("Broadcasting index data...")
                # Fetch index data
                data = {
                    "QQQ": get_index_data("QQQ"),
                    "SPY": get_index_data("SPY"),
                    "DIA": get_index_data("DIA"),
                }
                # Send data to all subscribed clients
                for sid in list(
                    user_tasks["indexes"]
                ):  # Use list() to avoid runtime errors if modified
                    try:
                        logging.debug(f"Broadcasting data to {sid}")
                        logging.debug(f"Data: {data}")

                        # Send data to the subscribed client
                        socketio.emit("data", data, to=sid, namespace="/indexes")
                    except Exception as e:
                        logging.error(
                            f"Error broadcasting data to {sid}: {e}. Function: broadcast_indexes_data"
                        )
                        user_tasks["indexes"].discard(sid)  # Remove disconnected client
            else:
                logging.info(
                    "Market is closed. Stopping index broadcasting. Waiting 60 seconds before checking again..."
                )
                # Wait until the market opens
                while not is_market_open():
                    gevent.sleep(60)  # Check every 60 seconds
                    logging.info(
                        "Waiting for market to open to broadcast index data..."
                    )
                logging.info("Market is open. Resuming index broadcasting...")
            gevent.sleep(15)  # Wait for 15 seconds before the next iteration
    except Exception as e:
        logging.error(f"Error in broadcast_indexes_data: {str(e)}")


def broadcast_stock_data():
    try:
        while True:
            if is_market_open():
                logging.info("Broadcasting stock data...")
                for sid, symbol in user_tasks[
                    "stock"
                ].items():  # Iterate over the dictionary
                    stock_info, option_chain = get_stock_data(symbol)

                    logging.debug(f"Broadcasting data to {sid}")
                    logging.debug(f"Data: {stock_info}")

                    # Send data to the subscribed client
                    socketio.emit(
                        "data",
                        {"info": stock_info, "option_chain": option_chain},
                        to=sid,
                        namespace="/stock",
                    )

            else:
                logging.info(
                    "Market is closed. Stopping stock broadcasting. Waiting 60 seconds before checking again..."
                )
                # Wait until the market opens
                while not is_market_open():
                    gevent.sleep(60)  # Check every 60 seconds
                    logging.info(
                        "Waiting for market to open to broadcast stock data..."
                    )
                logging.info("Market is open. Resuming stock broadcasting...")
            gevent.sleep(15)  # Wait for 15 seconds before the next iteration
    except Exception as e:
        logging.error(f"Error in broadcast_stock_data: {str(e)}")


# Start shared threads
gevent.spawn(broadcast_indexes_data)
gevent.spawn(broadcast_stock_data)


# Middleware to check the Origin header
@app.before_request
def before_request():
    origin = request.headers.get("Origin")
    logging.info(f"Origin: {origin}")
    # Check if the Origin header is present and matches the allowed origins
    if origin not in [site_url_one, site_url_two, site_url_three]:
        logging.warning(f"Invalid Origin: {origin}")
        return jsonify({"error": "Invalid Origin"}), 403


# Route for home
@app.route("/", methods=["GET"])
def home():
    return "Options Project"

# Route for Indexes Data
@app.route("/indexes-data", methods=["GET"])
def fetch_indexes_list_data():
    try:
        data = {
            "QQQ": get_index_data("QQQ"),
            "SPY": get_index_data("SPY"),
            "DIA": get_index_data("DIA"),
        }
        return jsonify(data)
    except Exception as e:
        logging.error(f"Error fetching index data: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Route for Stock Data
@app.route("/stock-data", methods=["GET"])
def fetch_stock_data():
    symbol = request.args.get("symbol")
    if not symbol:
        return jsonify({"error": "Symbol is required"}), 400
    try:
        stock_info, option_chain = get_stock_data(symbol)
        if not stock_info or not option_chain:
            logging.error(
                f"Failed to fetch stock data for {symbol}. Function: fetch_stock_data"
            )
            return jsonify({"error": "Failed to fetch stock data"}), 500
        return jsonify({"info": stock_info, "option_chain": option_chain})
    except Exception as e:
        logging.error(f"Error fetching stock data: {str(e)}")
        return jsonify({"error": str(e)}), 500


# WebSocket Index Data Subscription
@socketio.on("subscribe", namespace="/indexes")
def indexes_subscribe():
    try:
        sid = request.sid
        # Add the client to the set of subscribers for indexes
        user_tasks["indexes"].add(sid)
        emit(
            "message",
            {"message": "Subscribed to indexes namespace"},
            to=sid,
            namespace="/indexes",
        )
    except Exception as e:
        logging.error(f"Error in indexes subscribe: {str(e)}")
        emit(
            "error",
            {"error": f"Error in subscribe: {str(e)}"},
            to=sid,
            namespace="/indexes",
        )


# WebSocket Stock Data Subscription
@socketio.on("subscribe", namespace="/stock")
def stock_subscribe(data):
    try:
        sid = request.sid
        symbol = data.get("symbol")
        if not symbol:
            emit(
                "error",
                {"error": "Symbol is required"},
                to=sid,
                namespace="/stock",
            )
            return

        # Add or update the subscription for the client
        user_tasks["stock"][sid] = symbol.strip().lower()
        emit(
            "message",
            {"message": f"Subscribed to stock: {symbol}"},
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


# WebSocket Index Data Unsubscription
@socketio.on("unsubscribe", namespace="/indexes")
def indexes_unsubscribe():
    sid = request.sid
    user_tasks["indexes"].discard(sid)
    logging.info(f"Client {sid} unsubscribed from indexes namespace")


# WebSocket Stock Data Unsubscription
@socketio.on("unsubscribe", namespace="/stock")
def stock_unsubscribe():
    sid = request.sid
    if sid in user_tasks["stock"]:
        del user_tasks["stock"][sid]  # Remove the subscription for the client
    logging.info(f"Client {sid} unsubscribed from stock namespace")


import signal


def handle_shutdown(signal_number, frame):
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
        app, host="0.0.0.0", port=int(os.getenv("PORT", 8080)), log_output=True
    )
