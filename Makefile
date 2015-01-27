.PHONY: test

BIN = ./node_modules/.bin

test:
	@$(BIN)/jscs *.js test/*.js
	@$(BIN)/jshint *.js test/*.js
	@./node_modules/karma/bin/karma start --single-run=true