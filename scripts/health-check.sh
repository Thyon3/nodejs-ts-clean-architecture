#!/bin/sh

# Health check script for Docker container
# This script checks if the application is healthy

# Set the health check URL
HEALTH_URL="http://localhost:${PORT:-3000}/health"

# Use curl to check the health endpoint
response=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL")

# Check if the response code is 200 (OK)
if [ "$response" = "200" ]; then
    exit 0
else
    echo "Health check failed with status code: $response"
    exit 1
fi
