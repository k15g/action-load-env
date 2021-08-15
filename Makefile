build:
	@rm -rf dist
	@cp -r src/resources dist
	@npx tsc

run:
	@node dist/index.js

watch:
	@npx tsc --watch
