import { readFile } from 'fs/promises';
import {
  Schema,
  initialize,
} from './trustfall_wasm/trustfall_wasm.js';

initialize(); // Trustfall query system init.

const schemaSource = await readFile("./schema.graphql", "utf-8")
const SCHEMA = Schema.parse(schemaSource);
console.log(SCHEMA)
