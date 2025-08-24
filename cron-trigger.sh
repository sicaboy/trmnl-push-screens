#!/bin/bash

# TRMNL Calendar Cron Trigger Script
# This script calls the Vercel-hosted cron endpoint with proper authentication

# Configuration
CRON_SECRET="trmnl-cron-secret-2025\n"
URL="https://trmnl-push-screens.vercel.app/api/cron"
LOG_FILE="/Users/slj/work/trmnl-push-screens/cron.log"

# Create timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Log start
echo "[$TIMESTAMP] Starting cron trigger..." >> "$LOG_FILE"

# Make the request
response=$(curl -s -w "\nHTTP_CODE:%{http_code}\n" \
  -X GET \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -H "User-Agent: local-cron/1.0" \
  "$URL" 2>&1)

# Extract HTTP code
http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
response_body=$(echo "$response" | sed '/HTTP_CODE:/d')

# Log result
echo "[$TIMESTAMP] HTTP Code: $http_code" >> "$LOG_FILE"
echo "[$TIMESTAMP] Response: $response_body" >> "$LOG_FILE"

if [ "$http_code" = "200" ]; then
    echo "[$TIMESTAMP] SUCCESS: Calendar updated" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] ERROR: Failed to update calendar" >> "$LOG_FILE"
fi

echo "[$TIMESTAMP] Cron trigger completed" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"