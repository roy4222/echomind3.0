module.exports = {

"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/path [external] (path, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}}),
"[externals]/worker_threads [external] (worker_threads, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}}),
"[project]/node_modules/node-domexception/index.js [app-route] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */ if (!globalThis.DOMException) {
    try {
        const { MessageChannel } = __turbopack_context__.r("[externals]/worker_threads [external] (worker_threads, cjs)"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [
            ab,
            ab
        ]);
    } catch (err) {
        err.constructor.name === 'DOMException' && (globalThis.DOMException = err.constructor);
    }
}
module.exports = globalThis.DOMException;
}}),
"[project]/node_modules/formdata-node/lib/esm/isPlainObject.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const getType = (value)=>Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
function isPlainObject(value) {
    if (getType(value) !== "object") {
        return false;
    }
    const pp = Object.getPrototypeOf(value);
    if (pp === null || pp === undefined) {
        return true;
    }
    const Ctor = pp.constructor && pp.constructor.toString();
    return Ctor === Object.toString();
}
const __TURBOPACK__default__export__ = isPlainObject;
}}),
"[project]/node_modules/formdata-node/lib/esm/fileFromPath.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "fileFromPath": (()=>fileFromPath),
    "fileFromPathSync": (()=>fileFromPathSync)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$domexception$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/node-domexception/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$File$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/File.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$isPlainObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/isPlainObject.js [app-route] (ecmascript)");
var __classPrivateFieldSet = this && this.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var __classPrivateFieldGet = this && this.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FileFromPath_path, _FileFromPath_start;
;
;
;
;
;
;
const MESSAGE = "The requested file could not be read, " + "typically due to permission problems that have occurred after a reference " + "to a file was acquired.";
class FileFromPath {
    constructor(input){
        _FileFromPath_path.set(this, void 0);
        _FileFromPath_start.set(this, void 0);
        __classPrivateFieldSet(this, _FileFromPath_path, input.path, "f");
        __classPrivateFieldSet(this, _FileFromPath_start, input.start || 0, "f");
        this.name = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["basename"])(__classPrivateFieldGet(this, _FileFromPath_path, "f"));
        this.size = input.size;
        this.lastModified = input.lastModified;
    }
    slice(start, end) {
        return new FileFromPath({
            path: __classPrivateFieldGet(this, _FileFromPath_path, "f"),
            lastModified: this.lastModified,
            size: end - start,
            start
        });
    }
    async *stream() {
        const { mtimeMs } = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].stat(__classPrivateFieldGet(this, _FileFromPath_path, "f"));
        if (mtimeMs > this.lastModified) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$domexception$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](MESSAGE, "NotReadableError");
        }
        if (this.size) {
            yield* (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["createReadStream"])(__classPrivateFieldGet(this, _FileFromPath_path, "f"), {
                start: __classPrivateFieldGet(this, _FileFromPath_start, "f"),
                end: __classPrivateFieldGet(this, _FileFromPath_start, "f") + this.size - 1
            });
        }
    }
    get [(_FileFromPath_path = new WeakMap(), _FileFromPath_start = new WeakMap(), Symbol.toStringTag)]() {
        return "File";
    }
}
function createFileFromPath(path, { mtimeMs, size }, filenameOrOptions, options = {}) {
    let filename;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$isPlainObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(filenameOrOptions)) {
        [options, filename] = [
            filenameOrOptions,
            undefined
        ];
    } else {
        filename = filenameOrOptions;
    }
    const file = new FileFromPath({
        path,
        size,
        lastModified: mtimeMs
    });
    if (!filename) {
        filename = file.name;
    }
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$File$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["File"]([
        file
    ], filename, {
        ...options,
        lastModified: file.lastModified
    });
}
function fileFromPathSync(path, filenameOrOptions, options = {}) {
    const stats = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["statSync"])(path);
    return createFileFromPath(path, stats, filenameOrOptions, options);
}
async function fileFromPath(path, filenameOrOptions, options) {
    const stats = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].stat(path);
    return createFileFromPath(path, stats, filenameOrOptions, options);
}
}}),
"[project]/node_modules/formdata-node/lib/esm/fileFromPath.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$domexception$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/node-domexception/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$File$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/File.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$isPlainObject$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/isPlainObject.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$isFile$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/isFile.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/fileFromPath.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/formdata-node/lib/esm/fileFromPath.js [app-route] (ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "fileFromPath": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fileFromPath"]),
    "fileFromPathSync": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["fileFromPathSync"]),
    "isFile": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$isFile$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFile"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$isFile$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/isFile.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/fileFromPath.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/formdata-node/lib/esm/fileFromPath.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "fileFromPath": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$exports$3e$__["fileFromPath"]),
    "fileFromPathSync": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$exports$3e$__["fileFromPathSync"]),
    "isFile": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$exports$3e$__["isFile"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/fileFromPath.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formdata$2d$node$2f$lib$2f$esm$2f$fileFromPath$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i("[project]/node_modules/formdata-node/lib/esm/fileFromPath.js [app-route] (ecmascript) <exports>");
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__e14f4b46._.js.map