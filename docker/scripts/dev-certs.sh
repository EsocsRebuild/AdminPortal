#!/usr/bin/env sh
# Self-signed certificate for running the stack locally (browsers will warn).
# Writes to docker/certs/live/<name>/ in the same layout as Let's Encrypt.
set -eu
NAME="${1:-localhost}"
DIR="$(cd "$(dirname "$0")/.." && pwd)/certs/live/$NAME"
mkdir -p "$DIR"
openssl req -x509 -nodes -newkey rsa:2048 -days 30 \
  -keyout "$DIR/privkey.pem" -out "$DIR/fullchain.pem" \
  -subj "/CN=$NAME" -addext "subjectAltName=DNS:$NAME,IP:127.0.0.1" 2>/dev/null
cp "$DIR/fullchain.pem" "$DIR/chain.pem"
chmod 600 "$DIR/privkey.pem"
echo "Self-signed certificate for $NAME written to $DIR (valid 30 days)."
