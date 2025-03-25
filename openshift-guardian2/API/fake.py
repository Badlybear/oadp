import requests
import json
from itsdangerous import URLSafeTimedSerializer
import base64

# Simulate the session data
session_data = {
    "user": {"sub": "fake-user", "email": "fake@example.com"},
    "token": {"access_token": "fake-access-token"}
}

# The secret key must match the one in your FastAPI app
secret_key = "supersecret"

# Create a serializer object (matching SessionMiddleware)
serializer = URLSafeTimedSerializer(secret_key)

# Serialize and sign the session data
# SessionMiddleware expects a dict, not a JSON string, so we pass the dict directly
signed_session = serializer.dumps(session_data)  # This handles base64 encoding internally

# Set the session cookie with the signed value
session_cookie = {
    "session": signed_session
}

# Make the GET request
response = requests.get(
    "http://localhost:8000/get-user-namespaces",
    cookies=session_cookie,
    headers={"Accept": "application/json"}
)

# Print the response
print(response.status_code)
print(response.json())