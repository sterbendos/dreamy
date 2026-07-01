#!/bin/bash
# Script to approve a pending InstaPay payment locally or in production

# Usage: ./approve-payment.sh <pending_payment_id>

if [ -z "$1" ]; then
  echo "Usage: ./approve-payment.sh <pending_payment_id>"
  echo "You can find the pending_payment_id in your database (pending_payments table)."
  exit 1
fi

PENDING_ID=$1

# Change this to your production URL when running against prod
API_URL="http://localhost:3000/api/payment/approve"

# Make sure this matches the ADMIN_SECRET in your .env.local or Vercel
ADMIN_SECRET="your_admin_secret_here"

echo "Approving payment $PENDING_ID..."

curl -X POST $API_URL \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"pendingPaymentId\": \"$PENDING_ID\"}"

echo -e "\nDone!"
