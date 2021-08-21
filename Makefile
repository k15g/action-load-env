build:
	@rm -rf dist
	@cp -r src/resources dist
	@cp package.json dist/
	@npm install --only=prod --prefix ./dist
	@npx tsc

run:
	@node dist/index.js

watch:
	@npx tsc --watch
