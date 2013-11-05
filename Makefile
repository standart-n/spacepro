DATE = $(shell date +%I:%M%p)


install: 
	@mkdir -p ./lib/
	@npm install
	@./node_modules/.bin/grunt all


build:
	@./node_modules/.bin/grunt


test:
	@./node_modules/.bin/grunt test


finish:
	@echo "\nSuccessfully built at ${DATE}."


.PHONY: test
