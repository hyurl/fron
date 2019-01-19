const fs = require("fs");
const path = require("path");
const assert = require("assert");

exports.buffer = Buffer.from("Hello, World!");
exports.int8Array = Int8Array.from(exports.buffer);
exports.int16Array = Int16Array.from(exports.buffer);
exports.int32Array = Int32Array.from(exports.buffer);
exports.uint8Array = Uint8Array.from(exports.buffer);
exports.uint16Array = Uint16Array.from(exports.buffer);
exports.uint32Array = Uint32Array.from(exports.buffer);

exports.error = new Error("something went wrong");
exports.evalError = new EvalError(exports.error.message);
exports.rangeError = new RangeError(exports.error.message);
exports.referenceError = new ReferenceError(exports.error.message);
exports.syntaxError = new SyntaxError(exports.error.message);
exports.typeError = new TypeError(exports.error.message);
/** @type {assert.AssertionError} */
exports.assertionError = Object.create(assert.AssertionError.prototype);

try {
    assert.ok(false);
} catch (err) {
    exports.assertionError = err;
}

exports.regularReference = {
    abc: {
        prop1: "Hello, World",
        prop2: [
            "Hi, Ayon",
            [
                "Hello, World!"
            ]
        ]
    }
};
exports.regularReference.def = exports.regularReference.abc;
exports.regularReference.ghi = exports.regularReference.abc.prop2;
exports.regularReference.abc.prop2.push(exports.regularReference.abc.prop2[1]);

exports.circularReference = {
    abc: {
        prop1: "Hello, World",
        prop2: [
            "Hi, Ayon"
        ]
    }
};
exports.circularReference.def = exports.circularReference;
exports.circularReference.abc.prop3 = exports.circularReference.abc;
exports.circularReference.abc.prop2.push(exports.circularReference.abc.prop2);

/**
 * @param {string} name 
 */
function filename(name) {
    let ext = path.extname(name);
    let basename = path.basename(name, ext);

    if (["js", ".json", ".fron", ".bson"].includes(ext) === false) {
        ext = ".js";
    }

    return basename + ext;
}

/**
 * @param {string} name 
 */
function getData(name) {
    /** @type {string} */
    let data;
    try {
        data = fs.readFileSync(__dirname + "/" + filename(name), { encoding: "utf8" });
    } finally {
        return data;
    };
}

/**
 * @param {string} name 
 * @param {string} data 
 */
function setData(name, data) {
    let result = false;
    try {
        fs.writeFileSync(__dirname + "/" + filename(name), data, { encoding: "utf8" });
        result = true;
    } finally {
        return result;
    }
}

exports.getData = getData;
exports.setData = setData;