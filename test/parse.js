require("source-map-support/register");
const assert = require("assert");
const pick = require("object.pick");
const { parse } = require("..");
const {
    getData,
    int8Array,
    int16Array,
    int32Array,
    uint8Array,
    uint16Array,
    uint32Array,
    buffer,
    error,
    evalError,
    rangeError,
    referenceError,
    syntaxError,
    typeError,
    assertionError
} = require("./data");

/**
 * @param {Error} err 
 */
function accessError(err) {
    return Object.assign({}, err, pick(err, ["name", "message", "stack"]));
};

describe("Parser", () => {
    it("should parse a string literal as expected", () => {
        assert.strictEqual(parse(getData("literal-string")), "Hello, World!");
    });

    it("should parse a number literal as expected", () => {
        assert.strictEqual(parse(getData("literal-number")), 12345);
    });

    it("should parse boolean literals as expected", () => {
        assert.strictEqual(parse(getData("literal-boolean-true")), true);
        assert.strictEqual(parse(getData("literal-boolean-false")), false);
    });

    it("should parse a regexp literal as expected", () => {
        assert.deepStrictEqual(parse(getData("literal-regexp")), /[a-z]/i);
    });

    it("should parse special numbers as expected", () => {
        assert.ok(isNaN(parse(getData("literal-number-nan"))));
        assert.strictEqual(parse(getData("literal-number-infinity")), Infinity);
    });

    it("should parse a String instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-string")), new String("Hello, World!"));
    });

    it("should parse a Number instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-number")), new Number(12345));
    });

    it("should parse Boolean instances as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-boolean-true")), new Boolean(true));
        assert.deepStrictEqual(parse(getData("compound-boolean-false")), new Boolean(false));
    });

    it("should parse a Symbol instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-symbol")), Symbol.for("example"));
    });

    it("should parse a RegExp instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-regexp")), /[a-z]/i);
    });

    it("should parse a Date instance as expected", () => {
        let date = new Date("2019-01-01T00:00:00.000Z");
        assert.deepStrictEqual(parse(getData("compound-date")), date);
    });

    it("should parse an object as expected", () => {
        let data = {
            abc: "Hello, World!",
            efg: "Hi, Ayon!"
        };
        assert.deepStrictEqual(parse(getData("literal-object-1")), data);
    });

    it("should parse an object with quoted properties as expected", () => {
        let data = {
            "a b c": "Hello, World!",
            "e f g": "Hi, Ayon!",
            "你好": "世界"
        };
        assert.deepStrictEqual(parse(getData("literal-object-2")), data);
    });

    it("should parse an object with numeric properties as expected", () => {
        let data = {
            1: "Hello, World!",
            2: "Hi, Ayon!"
        };
        assert.deepStrictEqual(parse(getData("literal-object-3")), data);
    });

    it("should parse an object and prettify the output as expected", () => {
        let data = {
            abc: "Hello, World!",
            efg: "Hi, Ayon!"
        };
        assert.deepStrictEqual(parse(getData("literal-object-4")), data, true);
    });

    it("should parse an object and prettify the output with customized spaces as expected", () => {
        let data = {
            abc: "Hello, World!",
            efg: "Hi, Ayon!"
        };
        assert.deepStrictEqual(parse(getData("literal-object-5")), data, "    ");
    });

    it("should parse an array as expected", () => {
        let data = ["Hello, World!", "Hi, Ayon!"];
        assert.deepStrictEqual(parse(getData("literal-array-1")), data);
    });

    it("should parse an array and prettify the output as expected", () => {
        let data = ["Hello, World!", "Hi, Ayon!"];
        assert.deepStrictEqual(parse(getData("literal-array-2")), data, true);
    });

    it("should parse an array and prettify the output with customized spaces as expected", () => {
        let data = ["Hello, World!", "Hi, Ayon!"];
        assert.deepStrictEqual(parse(getData("literal-array-3")), data, "    ");
    });

    it("should parse a Map instance as expected", () => {
        let data = new Map([["abc", "Hello, World!"], [{ efg: "Hi, Ayon" }, 1]]);
        assert.deepStrictEqual(parse(getData("compound-map-1")), data);
    });

    it("should parse a Map instance and prettify the output as expected", () => {
        let data = new Map([["abc", "Hello, World!"], [{ efg: "Hi, Ayon" }, 1]]);
        assert.deepStrictEqual(parse(getData("compound-map-2")), data, true);
    });

    it("should parse a Set instance as expected", () => {
        let data = new Set([["abc", "Hello, World!"], [{ efg: "Hi, Ayon" }, 1]]);
        assert.deepStrictEqual(parse(getData("compound-set-1")), data);
    });

    it("should parse a Set instance and prettify the output as expected", () => {
        let data = new Set([["abc", "Hello, World!"], [{ efg: "Hi, Ayon" }, 1]]);
        assert.deepStrictEqual(parse(getData("compound-set-2")), data, true);
    });

    it("should parse an Int8Array instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-int8array")), int8Array);
    });

    it("should parse an Int16Array instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-int16array")), int16Array);
    });

    it("should parse an Int32Array instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-int32array")), int32Array);
    });

    it("should parse a Uint8Array instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-uint8array")), uint8Array);
    });

    it("should parse a Uint16Array instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-uint16array")), uint16Array);
    });

    it("should parse a Uint32Array instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-uint32array")), uint32Array);
    });

    it("should parse a Buffer instance as expected", () => {
        assert.deepStrictEqual(parse(getData("compound-buffer")), buffer);
    });

    it("should parse an Error instance as expected", () => {
        let data = parse(getData("compound-error"));
        assert.strictEqual(data.constructor, error.constructor);
        assert.deepStrictEqual(accessError(data), accessError(error));
    });

    it("should parse an EvalError instance as expected", () => {
        let data = parse(getData("compound-eval-error"));
        assert.strictEqual(data.constructor, evalError.constructor);
        assert.deepStrictEqual(accessError(data), accessError(evalError));
    });

    it("should parse a RangeError instance as expected", () => {
        let data = parse(getData("compound-range-error"));
        assert.strictEqual(data.constructor, rangeError.constructor);
        assert.deepStrictEqual(accessError(data), accessError(rangeError));
    });

    it("should parse a ReferenceError instance as expected", () => {
        let data = parse(getData("compound-reference-error"));
        assert.strictEqual(data.constructor, referenceError.constructor);
        assert.deepStrictEqual(accessError(data), accessError(referenceError));
    });

    it("should parse a SyntaxError instance as expected", () => {
        let data = parse(getData("compound-syntax-error"));
        assert.strictEqual(data.constructor, syntaxError.constructor);
        assert.deepStrictEqual(accessError(data), accessError(syntaxError));
    });

    it("should parse a TypeError instance as expected", () => {
        let data = parse(getData("compound-type-error"));
        assert.strictEqual(data.constructor, typeError.constructor);
        assert.deepStrictEqual(accessError(data), accessError(typeError));
    });

    it("should parse an AssertionError instance as expected", () => {
        let data = parse(getData("compound-assertion-error"));
        assert.strictEqual(data.constructor, assertionError.constructor);
        assert.deepStrictEqual(accessError(data), accessError(assertionError));
    });
});