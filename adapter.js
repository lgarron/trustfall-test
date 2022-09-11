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
const query = `
query {
  PackageLockFile {
    name @output
    version @output
    lockfileVersion @output
  }
}`;
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
  projectNeighbors(data_contexts, current_type_name, edge_name, parameters) {
    throw new Error("Unimplemented!");
  }
  canCoerceToType(data_contexts, current_type_name, coerce_to_type_name) {
    throw new Error("Unimplemented!");
  }
}
const adapter = new LockfileAdapter(PACKAGE_FOLDER);
const results = executeQuery(SCHEMA, adapter, query, {});
for (const result of results) {
  console.log(result);
}
export {
  LockfileAdapter
};
