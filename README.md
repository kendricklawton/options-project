Here’s an updated version of your README with the added information about using Google Cloud Run and Docker:

---

# Options Project API

This project provides real-time stock and index data through WebSockets and RESTful APIs. The application uses **Flask** for the backend and **Socket.IO** for real-time communication. It also utilizes **Gevent** for asynchronous behavior, allowing efficient handling of multiple WebSocket connections.

## Features

- **Real-time Stock & Index Data**: Subscribers can get real-time data about stock and index prices.
- **WebSocket Support**: Real-time data broadcasting via WebSockets for both stock and index data.
- **REST API**: Provides endpoints to fetch stock and index data.
- **Cache**: Caching is implemented for stock and index data using `cachetools`.
- **Market Data Subscription**: Clients can subscribe to updates for specific stocks and indexes.
- **CORS**: Cross-origin resource sharing (CORS) is enabled for specific domains.
- **Graceful Shutdown**: The server handles shutdown signals gracefully and cleans up resources.

## Technologies Used

- **CacheTools**: Used for caching stock and index data to reduce redundant API calls.
- **Docker**: Containerization of the application for easy deployment.
- **Flask**: Used as the web framework for creating the REST API.
- **Flask-CORS**: For enabling CORS in the Flask application.
- **Flask-SocketIO**: For handling WebSocket connections in Flask.
- **Gevent**: A coroutine-based library used for asynchronous networking and concurrency.
- **Google Cloud Run**: Deployment of the application on Google Cloud's serverless platform.
- **Gunicorn**: A Python WSGI HTTP server for UNIX, used to serve the Flask application.
- **Logging**: Python's built-in logging module is used for logging application events.
- **Pandas**: Used for handling and manipulating stock option chain data.
- **Python**: The backend is built using Python.
- **Python-dotenv**: For loading environment variables from a `.env` file.
- **Requests**: For making HTTP requests to external APIs.
- **Socket.IO**: Used to establish real-time communication with clients.
- **YFinance**: Used to fetch stock and index data.

## Setup and Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Create a virtual environment (optional but recommended)

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create a `.env` file

Create a `.env` file in the root directory and define the following environment variables:

```plaintext
SITE_URL_ONE=<your-site-url-one>
SITE_URL_TWO=<your-site-url-two>
SITE_URL_THREE=<your-site-url-three>
PORT=8080  # Optional: set the port to run the server
```

### 5. Run the application locally

```bash
python app.py
```

The server will be available at `http://localhost:8080`.

## Docker Support

This project provides a Dockerfile to build and run the application in a containerized environment. You can deploy the container on platforms such as Google Cloud Run.

### 1. Build the Docker image

To build the Docker image locally, run the following command:

```bash
docker build -t options-project-api .
```

### 2. Run the Docker container

Once the image is built, you can run it with:

```bash
docker run -p 8080:8080 options-project-api
```

The application will be available at `http://localhost:8080` inside the container.

## Deploying on Google Cloud Run

You can deploy this application on Google Cloud Run using the following steps:

1. **Build the Docker image** (if you haven't already):

   ```bash
   docker build -t gcr.io/<your-project-id>/options-project-api .
   ```

2. **Push the Docker image to Google Container Registry**:

   ```bash
   docker push gcr.io/<your-project-id>/options-project-api
   ```

3. **Deploy the image to Google Cloud Run**:

   You can use the Google Cloud Console or the `gcloud` CLI to deploy:

   ```bash
   gcloud run deploy options-project-api \
     --image gcr.io/<your-project-id>/options-project-api \
     --platform managed \
     --port 8080 \
     --region <your-region> \
     --allow-unauthenticated
   ```

   Replace `<your-project-id>` and `<your-region>` with your actual Google Cloud project ID and preferred region.

4. Once the deployment is complete, your application will be live on Google Cloud Run, and you will receive a URL to access it.

## API Endpoints

### 1. `/indexes-data` [GET]
Fetches real-time data for major indexes such as QQQ, SPY, and DIA.

**Response:**
```json
{
  "QQQ": { ... },
  "SPY": { ... },
  "DIA": { ... }
}
```

### 2. `/stock-data` [GET]
Fetches real-time stock data and options chain data for a given stock symbol.

**Query Parameters:**
- `symbol`: The stock symbol to fetch data for (e.g., AAPL, TSLA).

**Example:**
```bash
GET /stock-data?symbol=AAPL
```

**Response:**
```json
{
  "info": { ... },
  "option_chain": { ... }
}
```

## WebSocket Support

### 1. `/indexes` namespace
- **subscribe**: Subscribe to receive updates for major indexes (QQQ, SPY, DIA).
- **unsubscribe**: Unsubscribe from receiving updates.

### 2. `/stock` namespace
- **subscribe**: Subscribe to receive stock data updates for a specific stock symbol.
  - Payload: `{ "symbol": "AAPL" }`
- **unsubscribe**: Unsubscribe from stock data updates.

## Background Task

- The application continuously fetches and broadcasts index and stock data to subscribed clients while the market is open.
- **Gevent** is used to run the background task asynchronously, allowing the server to handle multiple connections.

## Logging and Debugging

The application uses Python's built-in logging to log all activities, including data fetching, errors, and system shutdown events. Logs are printed to stdout for easy access, especially when running on platforms like Google Cloud Run.

## Graceful Shutdown

The server listens for shutdown signals (`SIGINT`, `SIGTERM`) and performs cleanup tasks, ensuring that all market tasks are cleared before exiting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.