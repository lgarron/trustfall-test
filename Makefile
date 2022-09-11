.PHONY: test
test: adapter.js
	node --experimental-modules --experimental-wasm-modules ./adapter.js

adapter.js: adapter.ts
	npx esbuild --format=esm ./adapter.ts --outfile=./adapter.js
