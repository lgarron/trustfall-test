import { readFile } from "fs/promises";
import { readFileSync } from "fs";
import {
  Schema,
  initialize,
  executeQuery
} from "./trustfall_wasm/trustfall_wasm.js";
initialize();
const PACKAGE_FOLDER = new URL("./data/", import.meta.url);
const schemaSource = await readFile("./schema.graphql", "utf-8");
const SCHEMA = Schema.parse(schemaSource);
console.log(SCHEMA);
class LockfileAdapter {
  constructor(folderPath) {
    this.packageJSON = JSON.parse(readFileSync(new URL("package.json", folderPath), "utf-8"));
    this.packageLockJSON = JSON.parse(readFileSync(new URL("package-lock.json", folderPath), "utf-8"));
  }
  *getStartingTokens(edge, parameters) {
    switch (edge) {
      case "PackageFile": {
        yield this.packageJSON;
      }
      case "PackageLockFile": {
        yield this.packageLockJSON;
      }
    }
  }
  *projectProperty(data_contexts, current_type_name, field_name) {
    switch (current_type_name) {
      case "PackageDependency":
      case "PackageFileCommon":
      case "PackageFile":
      case "PackageLockFile": {
        for (const data_context of data_contexts) {
          switch (field_name) {
            case "name":
            case "version":
            case "lockfileVersion": {
              const { localId } = data_context;
              const value = data_context.currentToken?.[field_name] ?? null;
              yield { localId, value };
            }
          }
        }
      }
    }
  }
  *projectNeighbors(data_contexts, current_type_name, edge_name, parameters) {
    switch (current_type_name) {
      case "PackageLockFile": {
        for (const data_context of data_contexts) {
          switch (edge_name) {
            case "dependencies": {
              const { localId } = data_context;
              const currentToken = data_context.currentToken;
              function* neighbors() {
                const packageNames = Object.keys(currentToken?.dependencies ?? {});
                for (const packageName of packageNames) {
                  yield { ...this.packageLockJSON.dependencies[packageName], name: packageName };
                }
              }
              yield { localId, neighbors: neighbors() };
            }
          }
        }
      }
      case "PackageDependency": {
        for (const data_context of data_contexts) {
          switch (edge_name) {
            case "requires": {
              const { localId } = data_context;
              const currentToken = data_context.currentToken;
              function* neighbors() {
                const packageNames = Object.keys(currentToken?.requires ?? {});
                for (const packageName of packageNames) {
                  yield { ...this.packageLockJSON.dependencies[packageName], name: packageName };
                }
              }
              yield { localId, neighbors: neighbors() };
            }
          }
        }
      }
    }
  }
  canCoerceToType(data_contexts, current_type_name, coerce_to_type_name) {
    throw new Error("Unimplemented!");
  }
}
const adapter = new LockfileAdapter(PACKAGE_FOLDER);
const query = `
query {
  PackageLockFile {
    dependencies {
      name @filter(op: "=", value: ["$packageName"]) @output
    }
  }
}`;
const results = executeQuery(SCHEMA, adapter, query, { packageName: "three" });
for (const result of results) {
  console.log(result);
}
export {
  LockfileAdapter
};
