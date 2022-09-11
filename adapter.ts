import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import {
  Schema,
  initialize,
  Adapter,
  JsEdgeParameters,
} from './trustfall_wasm/trustfall_wasm.js';

initialize(); // Trustfall query system init.

const PACKAGE_FOLDER = new URL("./data/", import.meta.url);

const schemaSource = await readFile("./schema.graphql", "utf-8")
const SCHEMA = Schema.parse(schemaSource);
console.log(SCHEMA)

const query = `
query {
  PackageLockFile {
    name @output
    version @output
  }
}`

export class LockfileAdapter implements Adapter<any> {
  packageJSON: any;
  packageLockJSON: any
  constructor(folderPath: string | URL) {
    this.packageJSON = JSON.parse(readFileSync(new URL("package.json", folderPath), "utf-8"));
    this.packageLockJSON = JSON.parse(readFileSync(new URL("package-lock.json", folderPath), "utf-8"));
  }

  *getStartingTokens(edge: string, parameters: JsEdgeParameters): IterableIterator<any> {
    switch (edge) {
      case "PackageFile": {
        yield this.packageJSON
      }
      case "PackageLockFile": {
        yield this.packageLockJSON
      }
    }
  }
}

new LockfileAdapter(PACKAGE_FOLDER)
