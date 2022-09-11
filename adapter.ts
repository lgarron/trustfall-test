import { readFile } from 'fs/promises';
import {
  Schema,
  initialize,
  Adapter,
  JsEdgeParameters,
} from './trustfall_wasm/trustfall_wasm.js';

initialize(); // Trustfall query system init.

const schemaSource = await readFile("./schema.graphql", "utf-8")
const SCHEMA = Schema.parse(schemaSource);
console.log(SCHEMA)

const query = `
query {
  Lockfile {
    name @output
    version @output
  }
}`

export class LockfileAdapter implements Adapter<any> {
  getStartingTokens(edge: string, parameters: JsEdgeParameters): IterableIterator<any> {
      throw new Error("Sf");
  }
}

