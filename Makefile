DATE = $(shell date +%I:%M%p)


install: dev i18n

dev:
	@mkdir -p ./lib/
	@npm install
	@./node_modules/.bin/grunt all --force
	@./node_modules/.bin/gulp po2json

i18n:
	@./node_modules/.bin/gulp po2json

build:
	@./node_modules/.bin/grunt


test:
	@./node_modules/.bin/grunt test


finish:
	@echo "\nSuccessfully built at ${DATE}."


.PHONY: test
