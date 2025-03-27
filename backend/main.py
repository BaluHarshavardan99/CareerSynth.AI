import asyncio
from fastapi import FastAPI, Response
from flask import Request, jsonify
import functions_framework
from your_routes import app
import os

os.environ["GCP_PROJECT_ID"] = "rbs-backend-447700"

@functions_framework.http
def handler(request: Request):
    """Handle incoming HTTP request and route it through FastAPI application."""
    
    # Store response data
    response_data = {"status": 200, "body": b"", "headers": {}}
    
    # Convert Flask/Functions Framework request to FastAPI
    path = request.path
    if path.startswith('/rbs-backend'):
        path = path[len('/rbs-backend'):]
    
    scope = {
        "type": "http",
        "http_version": "1.1",
        "method": request.method,
        "scheme": "https",
        "path": path,
        "raw_path": path.encode(),
        "query_string": request.query_string,
        "headers": [
            (k.lower().encode(), v.encode())
            for k, v in request.headers.items()
        ],
        "client": ("", 0),
        "server": ("", 0),
    }

    async def receive():
        # Get the request body
        body = request.get_data()
        return {
            "type": "http.request",
            "body": body,
            "more_body": False,
        }

    send_queue = asyncio.Queue()
    async def send(message):
        await send_queue.put(message)

    async def process_request():
        try:
            # Call the FastAPI application
            await app(scope, receive, send)
            
            # Process all messages
            response_started = False
            response_body = b""
            while not send_queue.empty():
                message = await send_queue.get()
                if message["type"] == "http.response.start":
                    response_data["status"] = message["status"]
                    response_data["headers"] = {
                        k.decode('utf-8'): v.decode('utf-8')
                        for k, v in message.get("headers", [])
                    }
                    response_started = True
                elif message["type"] == "http.response.body":
                    response_body += message.get("body", b"")
            
            response_data["body"] = response_body
            
        except Exception as e:
            response_data["status"] = 500
            response_data["body"] = str(e).encode()

    # Create and manage event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        loop.run_until_complete(process_request())
    finally:
        loop.close()

    # Convert response body if it's bytes
    if isinstance(response_data["body"], bytes):
        try:
            response_body = response_data["body"].decode('utf-8')
        except UnicodeDecodeError:
            response_body = response_data["body"]
    else:
        response_body = response_data["body"]

    # Return the response
    return (response_body, response_data["status"], response_data["headers"])