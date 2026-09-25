# ESOCS Admin: common operations. Run `make help`.
SHELL := /bin/sh
COMPOSE := docker compose
LOCAL := docker compose -f compose.yml -f compose.local.yml
VERSION ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo latest)

.DEFAULT_GOAL := help
.PHONY: help secrets build up down restart logs ps certs-dev certs-init certs-renew local local-down nginx-test

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

secrets: ## Print a new NEXT_SERVER_ACTIONS_ENCRYPTION_KEY for .env
	@echo "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=$$(openssl rand -base64 32)"

build: ## Build the portal image (tagged with the git commit)
	DEPLOYMENT_VERSION=$(VERSION) $(COMPOSE) build portal

up: ## Start the production stack in the background
	DEPLOYMENT_VERSION=$(VERSION) $(COMPOSE) up -d --build --wait

down: ## Stop the stack
	$(COMPOSE) down

restart: ## Rolling restart of the portal
	$(COMPOSE) up -d --no-deps --wait portal

logs: ## Follow logs
	$(COMPOSE) logs -f --tail=100

ps: ## Show container status and health
	$(COMPOSE) ps

nginx-test: ## Validate the nginx configuration inside the running proxy
	$(COMPOSE) exec proxy nginx -t

certs-dev: ## Self-signed certificate for localhost
	sh docker/scripts/dev-certs.sh localhost

certs-init: ## First-time Let's Encrypt certificate (needs DNS + ports 80/443)
	sh docker/scripts/init-letsencrypt.sh

certs-renew: ## Renew certificates and reload nginx (schedule daily)
	$(COMPOSE) --profile certbot run --rm certbot renew --quiet
	$(COMPOSE) exec proxy nginx -s reload

local: ## Run the production stack locally at https://localhost:8443
	$(LOCAL) up --build --wait

local-down: ## Stop the local stack
	$(LOCAL) down
