import { readFileSync } from 'fs';
import { readFile } from 'fs/promises';
import {
  Schema,
  initialize,
  Adapter,
  JsEdgeParameters,
  ContextAndValue,
  JsContext,
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

type PackageFile = {
  name: string
  version: string
}

type Vertices = PackageFile

export class LockfileAdapter implements Adapter<Vertices> {
  packageJSON: any;
  packageLockJSON: any;
  constructor(folderPath: string | URL) {
    this.packageJSON = JSON.parse(readFileSync(new URL("package.json", folderPath), "utf-8"));
    this.packageLockJSON = JSON.parse(readFileSync(new URL("package-lock.json", folderPath), "utf-8"));
  }

  *getStartingTokens(edge: string, parameters: JsEdgeParameters): IterableIterator<Vertices> {
    switch (edge) {
      case "PackageFile": {
        yield this.packageJSON
      }
      case "PackageLockFile": {
        yield this.packageLockJSON
      }
    }
  }

  *projectProperty(data_contexts: IterableIterator<JsContext<Vertices>>, current_type_name: string, field_name: string): IterableIterator<ContextAndValue> {
    switch (current_type_name) {
      case "PackageFileCommon":
      case "PackageFile":
      // fallthrough
      case "PackageLockFile": {
        for (const data_context of data_contexts) {
          switch (field_name) {
            case "name":
            // fallthrough
            case "version":
            // fallthrough
            case "lockfileVersion": {
              const { localId } = data_context;
              const value: string | number | null = data_context.currentToken?.[field_name] ?? null;
              yield { localId, value }
            }
          }
        }
      }
    }
  }
}

new LockfileAdapter(PACKAGE_FOLDER);
