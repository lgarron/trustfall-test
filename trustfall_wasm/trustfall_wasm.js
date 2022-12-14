let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { iterify } = require(String.raw`./snippets/trustfall_wasm-7ec00372f6bf29da/inline0.js`);
const { TextEncoder, TextDecoder, inspect } = require(`util`);

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = new Float64Array();

function getFloat64Memory0() {
    if (cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}
/**
* @param {Schema} schema
* @param {any} adapter
* @param {string} query
* @param {any} args
* @returns {QueryResultIterator}
*/
module.exports.executeQuery = function(schema, adapter, query, args) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(schema, Schema);
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.executeQuery(retptr, schema.ptr, addHeapObject(adapter), ptr0, len0, addHeapObject(args));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return QueryResultIterator.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
*/
module.exports.initialize = function() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.initialize(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
class ContextIterator {

    static __wrap(ptr) {
        const obj = Object.create(ContextIterator.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contextiterator_free(ptr);
    }
    /**
    * @returns {ContextIteratorItem}
    */
    next() {
        const ret = wasm.contextiterator_next(this.ptr);
        return ContextIteratorItem.__wrap(ret);
    }
}
module.exports.ContextIterator = ContextIterator;
/**
*/
class ContextIteratorItem {

    static __wrap(ptr) {
        const obj = Object.create(ContextIteratorItem.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contextiteratoritem_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    get done() {
        const ret = wasm.contextiteratoritem_done(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {JsContext | undefined}
    */
    get value() {
        const ret = wasm.contextiteratoritem_value(this.ptr);
        return ret === 0 ? undefined : JsContext.__wrap(ret);
    }
}
module.exports.ContextIteratorItem = ContextIteratorItem;
/**
*/
class FrontendError {

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_frontenderror_free(ptr);
    }
}
module.exports.FrontendError = FrontendError;
/**
*/
class InvalidIRQueryError {

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_invalidirqueryerror_free(ptr);
    }
}
module.exports.InvalidIRQueryError = InvalidIRQueryError;
/**
*/
class InvalidSchemaError {

    static __wrap(ptr) {
        const obj = Object.create(InvalidSchemaError.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_invalidschemaerror_free(ptr);
    }
}
module.exports.InvalidSchemaError = InvalidSchemaError;
/**
*/
class JsContext {

    static __wrap(ptr) {
        const obj = Object.create(JsContext.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jscontext_free(ptr);
    }
    /**
    * @returns {number}
    */
    get localId() {
        const ret = wasm.__wbg_get_jscontext_localId(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set localId(arg0) {
        wasm.__wbg_set_jscontext_localId(this.ptr, arg0);
    }
    /**
    * @returns {any}
    */
    get currentToken() {
        const ret = wasm.jscontext_currentToken(this.ptr);
        return takeObject(ret);
    }
}
module.exports.JsContext = JsContext;
/**
*/
class JsEdgeParameters {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_jsedgeparameters_free(ptr);
    }
    /**
    * @param {string} name
    * @returns {any}
    */
    get(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.jsedgeparameters_get(this.ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @returns {any}
    */
    into_js_dict() {
        const ret = wasm.jsedgeparameters_into_js_dict(this.ptr);
        return takeObject(ret);
    }
}
module.exports.JsEdgeParameters = JsEdgeParameters;
/**
*/
class ParseError {

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_parseerror_free(ptr);
    }
}
module.exports.ParseError = ParseError;
/**
*/
class QueryArgumentsError {

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_queryargumentserror_free(ptr);
    }
}
module.exports.QueryArgumentsError = QueryArgumentsError;
/**
*/
class QueryResultItem {

    static __wrap(ptr) {
        const obj = Object.create(QueryResultItem.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_queryresultitem_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    get done() {
        const ret = wasm.queryresultitem_done(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {any}
    */
    get value() {
        const ret = wasm.queryresultitem_value(this.ptr);
        return takeObject(ret);
    }
}
module.exports.QueryResultItem = QueryResultItem;
/**
*/
class QueryResultIterator {

    static __wrap(ptr) {
        const obj = Object.create(QueryResultIterator.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_queryresultiterator_free(ptr);
    }
    /**
    * @returns {QueryResultItem}
    */
    next() {
        const ret = wasm.queryresultiterator_next(this.ptr);
        return QueryResultItem.__wrap(ret);
    }
}
module.exports.QueryResultIterator = QueryResultIterator;
/**
*/
class Schema {

    static __wrap(ptr) {
        const obj = Object.create(Schema.prototype);
        obj.ptr = ptr;

        return obj;
    }

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_schema_free(ptr);
    }
    /**
    * @param {string} input
    * @returns {Schema}
    */
    static parse(input) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(input, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.schema_parse(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Schema.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
module.exports.Schema = Schema;
/**
*/
class ValidationError {

    toJSON() {
        return {
        };
    }

    toString() {
        return JSON.stringify(this);
    }

    [inspect.custom]() {
        return Object.assign(Object.create({constructor: this.constructor}), this.toJSON());
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_validationerror_free(ptr);
    }
}
module.exports.ValidationError = ValidationError;

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_json_serialize = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = JSON.stringify(obj === undefined ? null : obj);
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_invalidschemaerror_new = function(arg0) {
    const ret = InvalidSchemaError.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbg_contextiterator_new = function(arg0) {
    const ret = ContextIterator.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_queryresultiterator_new = function(arg0) {
    const ret = QueryResultIterator.__wrap(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

module.exports.__wbg_getStartingTokens_4311e8fbd98a7147 = function(arg0, arg1, arg2, arg3) {
    const ret = getObject(arg0).getStartingTokens(getStringFromWasm0(arg1, arg2), takeObject(arg3));
    return addHeapObject(ret);
};

module.exports.__wbg_projectProperty_34fe60840b971b0e = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    const ret = getObject(arg0).projectProperty(ContextIterator.__wrap(arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5));
    return addHeapObject(ret);
};

module.exports.__wbg_projectNeighbors_0e7ab848b1eee864 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    const ret = getObject(arg0).projectNeighbors(ContextIterator.__wrap(arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), takeObject(arg6));
    return addHeapObject(ret);
};

module.exports.__wbg_canCoerceToType_2b6b6ecc7b0ef574 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
    const ret = getObject(arg0).canCoerceToType(ContextIterator.__wrap(arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5));
    return addHeapObject(ret);
};

module.exports.__wbindgen_json_parse = function(arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_iterify_4e224c3222b26363 = function(arg0) {
    iterify(getObject(arg0));
};

module.exports.__wbg_new_693216e109162396 = function() {
    const ret = new Error();
    return addHeapObject(ret);
};

module.exports.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbg_next_726d1c2255989269 = function(arg0) {
    const ret = getObject(arg0).next;
    return addHeapObject(ret);
};

module.exports.__wbg_next_3d0c4cc33e7418c9 = function() { return handleError(function (arg0) {
    const ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_done_e5655b169bb04f60 = function(arg0) {
    const ret = getObject(arg0).done;
    return ret;
};

module.exports.__wbg_value_8f901bca1014f843 = function(arg0) {
    const ret = getObject(arg0).value;
    return addHeapObject(ret);
};

module.exports.__wbg_iterator_22ed2b976832ff0c = function() {
    const ret = Symbol.iterator;
    return addHeapObject(ret);
};

module.exports.__wbg_get_72332cd2bc57924c = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_call_33d7bcddbbfa394a = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_getPrototypeOf_d6d1f0000eddc427 = function(arg0) {
    const ret = Object.getPrototypeOf(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'trustfall_wasm_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

