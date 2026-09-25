#!/usr/bin/env sh
# First-time Let's Encrypt issuance. nginx can't start without a certificate,
# so: create a placeholder, start the stack, request the real certificate over
# HTTP-01, then reload nginx. Requires DNS for SERVER_NAME to point here and
# ports 80/443 open. Set STAGING=1 to test against the staging CA first.
set -eu
cd "$(dirname "$0")/../.."
[ -f .env ] || { echo "Missing .env (copy .env.docker.example)"; exit 1; }
set -a; . ./.env; set +a
: "${SERVER_NAME:?}" "${CERTBOT_EMAIL:?}"

LIVE="docker/certs/live/$SERVER_NAME"
if [ -f "$LIVE/fullchain.pem" ] && [ ! -f "$LIVE/.placeholder" ]; then
  echo "A certificate already exists for $SERVER_NAME. Use 'make certs-renew'."; exit 0
fi

echo "→ Creating a temporary certificate so nginx can start"
sh docker/scripts/dev-certs.sh "$SERVER_NAME" >/dev/null
touch "$LIVE/.placeholder"
docker compose up -d --wait

echo "→ Requesting a certificate from Let's Encrypt"
rm -rf "docker/certs/live/$SERVER_NAME" "docker/certs/archive/$SERVER_NAME" "docker/certs/renewal/$SERVER_NAME.conf"
# Keep nginx serving while the placeholder is gone (it has the cert loaded in memory).
STAGING_FLAG=""; [ "${STAGING:-0}" = "1" ] && STAGING_FLAG="--staging"
docker compose --profile certbot run --rm certbot certonly --webroot -w /var/www/certbot \
  -d "$SERVER_NAME" --email "$CERTBOT_EMAIL" --agree-tos --no-eff-email --rsa-key-size 4096 $STAGING_FLAG

echo "→ Reloading nginx with the real certificate"
docker compose exec proxy nginx -s reload
echo "Done. https://$SERVER_NAME is live."
