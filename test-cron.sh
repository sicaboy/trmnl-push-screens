#!/bin/bash

# Test script for cron endpoint
CRON_SECRET="trmnl-cron-secret-2025\n"
URL="https://trmnl-push-screens.vercel.app/api/cron"

echo "Testing cron endpoint with authentication..."
echo "CRON_SECRET: $CRON_SECRET"
echo "URL: $URL"
echo ""

# Test with curl
response=$(curl -s -w "\nHTTP_CODE:%{http_code}\n" \
  -X GET \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  "$URL")

echo "Response:"
echo "$response"