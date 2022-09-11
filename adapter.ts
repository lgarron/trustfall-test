import { readFile } from 'fs/promises';
import { readFileSync } from 'fs';
import {
  Schema,
  initialize,
  Adapter,
  JsEdgeParameters,
  ContextAndValue,
  JsContext,
  ContextAndNeighborsIterator,
  ContextAndBool,
  executeQuery,
} from './trustfall_wasm/trustfall_wasm.js';

initialize(); // Trustfall query system init.

const PACKAGE_FOLDER = new URL("./data/", import.meta.url);

const schemaSource = await readFile("./schema.graphql", "utf-8")
const SCHEMA = Schema.parse(schemaSource);
console.log(SCHEMA)

// TODO Lockfile
type PackageFile = {
  name: string
  version: string
}

// TODO Lockfile
type PackageLockFile = {
  name: string
  version: string
  lockfileVersion: number
  dependencies: Record<string, PackageDependency>
}

interface PackageDependency {
  name: string
  version: string
  requires: Record<string, string>
}

type Vertices = PackageFile | PackageLockFile | PackageDependency

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
      case "PackageDependency":
        // fallthrough
      case "PackageFileCommon":
        // fallthrough
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

  *projectNeighbors(data_contexts: IterableIterator<JsContext<Vertices>>, current_type_name: string, edge_name: string, parameters: JsEdgeParameters): IterableIterator<ContextAndNeighborsIterator<Vertices>> {
    switch (current_type_name) {
      case "PackageLockFile": {
        for (const data_context of data_contexts) {
          switch (edge_name) {
            case "dependencies": {
              const { localId } = data_context;
              const currentToken = data_context.currentToken as PackageLockFile | null;
              const that = this;
              function* neighbors() {
                const packageNames = Object.keys(currentToken?.dependencies ?? {})
                for (const packageName of packageNames) {
                  yield { ...that.packageLockJSON.dependencies[packageName], name: packageName }
                }
              }
              yield { localId, neighbors: neighbors() }
            }
          }
        }
      }
      case "PackageDependency": {
        for (const data_context of data_contexts) {
          switch (edge_name) {
            case "requires": {
              const { localId } = data_context;
              const currentToken = data_context.currentToken as PackageDependency | null;
              const that = this;
              function *neighbors() {
                const packageNames = Object.keys(currentToken?.requires ?? {})
                for (const packageName of packageNames) {
                  yield { ...that.packageLockJSON.dependencies[packageName], name: packageName}
                }
              }
              yield {localId, neighbors: neighbors()}
            }
          }
        }
      }
    }
  }

  canCoerceToType(data_contexts: IterableIterator<JsContext<PackageFile>>, current_type_name: string, coerce_to_type_name: string): IterableIterator<ContextAndBool> {
    throw new Error("Unimplemented!");
  }
}

const adapter = new LockfileAdapter(PACKAGE_FOLDER);

// const query = `
// query {
//   PackageLockFile {
//     name @output
//     version @output
//     lockfileVersion @output
//   }
// }`

// const results = executeQuery(SCHEMA, adapter, query, {});
// for (const result of results) {
//   console.log(result);
// }


const query = `
query {
  PackageLockFile {
    dependencies {
      name @filter(op: "=", value: ["$packageName"]) @output
      version @output
      requires @fold {
        foo: name @output
      }
    }
  }
}`

const results = executeQuery(SCHEMA, adapter, query, {packageName: "typedoc"});
for (const result of results) {
  console.log(result);
}
