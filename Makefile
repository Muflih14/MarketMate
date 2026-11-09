# ------------------------------------------------------------------------------
# IMPORTANT NOTE:
# This file requires tabs to work properly, do not substitute them with spaces.
# ------------------------------------------------------------------------------

SHELL := /bin/bash

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "Available commands:"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% 0-9a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-40s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

# ------------------------------------------------------------------------------

install: ## Install market-mate dependencies
	cd market-mate && pnpm install

serve: ## Run the market-mate dev server
	cd market-mate && pnpm dev

build: ## Build market-mate
	cd market-mate && pnpm build

lint: ## Execute pre-commit and market-mate lint checks
	pre-commit run --all-files
	cd market-mate && pnpm lint

format: ## Apply market-mate lint formats
	cd market-mate && pnpm lint:fix

test: ## Run market-mate tests
	cd market-mate && pnpm test

test-lint: lint ## Run linting checks

update-deps: update-deps-lint update-deps-app ## Update dependencies

update-deps-app: ## Update market-mate dependencies
	cd market-mate && pnpm update

update-deps-lint: ## Update pre-commit hooks
	pre-commit autoupdate
