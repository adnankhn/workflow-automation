# Python Execution Server for Workflow Node Editor

This simple Flask server allows the Workflow Node Editor to execute Python code on your local machine.

## Setup

1. Make sure you have Python 3.6+ installed on your machine
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

3. Start the server:

```bash
python server.py
```

The server will run on http://localhost:5000 by default.

## How it works

The server exposes an `/execute` endpoint that accepts POST requests with Python code and input data. It executes the code in a controlled environment and returns the output, errors, and any result value.

## Security Considerations

This server executes arbitrary Python code, which can be a security risk. It is intended for local development only and should not be exposed to the internet or used in production environments without proper security measures.

Only run this server on your local machine and only execute code that you trust.
