.PHONY: build start stop live-reload test coverage lint generate-migration migration-up migration-down
# Load environment variables
include .env
export

# Define variable for migration directory and PostgreSQL URL
MIGRATION_SOURCE = dist/infraestructure/database/db.js

# Docker tasks
build:
	docker-compose -p nodejs-ts-clean-architecture build

start:
	docker-compose up -d

stop:
	docker-compose down

