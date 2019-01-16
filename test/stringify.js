require("source-map-support/register");
const assert = require("assert");
const { stringify } = require("..");
const {
    getData,
    setData,
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

before(() => {
    setData("compound-error", stringify(error, true))
    setData("compound-eval-error", stringify(evalError, true))
    setData("compound-range-error", stringify(rangeError, true))
    setData("compound-reference-error", stringify(referenceError, true))
    setData("compound-syntax-error", stringify(syntaxError, true))
    setData("compound-type-error", stringify(typeError, true))
    setData("compound-assertion-error", stringify(assertionError, true))
});

describe("Stringifier", () => {
    it("should stringify a string literal as expected", () => {
        assert.strictEqual(stringify("Hello, World!"), getData("literal-string"));
    });

    it("should stringify a number literal as expected", () => {
        assert.strictEqual(stringify(12345), getData("literal-number"));
    });

    it("should stringify boolean literals as expected", () => {
        assert.strictEqual(stringify(true), getData("literal-boolean-true"));
        assert.strictEqual(stringify(false), getData("literal-boolean-false"));
    });

    it("should stringify a regexp literal as expected", () => {
        assert.strictEqual(stringify(/[a-z]/i), getData("literal-regexp"));
    });

    it("should stringify special numbers as expected", () => {
        assert.strictEqual(stringify(NaN), getData("literal-number-nan"));
        assert.strictEqual(stringify(Infinity), getData("literal-number-infinity"));
    });

    it("should stringify a String instance as expected", () => {
        assert.strictEqual(stringify(new String("Hello, World!")), getData("compound-string"));
    });

    it("should stringify a Number instance as expected", () => {
        assert.strictEqual(stringify(new Number(12345)), getData("compound-number"));
    });

    it("should stringify Boolean instances as expected", () => {
        assert.strictEqual(stringify(new Boolean(true)), getData("compound-boolean-true"));
        assert.strictEqual(stringify(new Boolean(false)), getData("compound-boolean-false"));
    });

    it("should stringify a Symbol instance as expected", () => {
        assert.strictEqual(stringify(Symbol.for("example")), getData("compound-symbol"));
    });

    it("should stringify a Date instance as expected", () => {
        let date = new Date("2019-01-01T00:00:00.000Z");
        assert.strictEqual(stringify(date), getData("compound-date"));
    });

    it("should stringify an object as expected", () => {
        let data = {
            abc: "Hello, World!",
            efg: "Hi, Ayon!"
        };
        assert.strictEqual(stringify(data), getData("literal-object-1"));
    });

    it("should stringify an object with quoted properties as expected", () => {
        let data = {
            "a b c": "Hello, World!",
            "e f g": "Hi, Ayon!",
            "你好": "世界"
        };
        assert.strictEqual(stringify(data), getData("literal-object-2"));
    });

    it("should stringify an object with numeric properties as expected", () => {
        let data = {
            1: "Hello, World!",
            2: "Hi, Ayon!"
        };
        assert.strictEqual(stringify(data), getData("literal-object-3"));
    });

    it("should stringify an object and prettify the output as expected", () => {
        let data = {
            abc: "Hello, World!",
            efg: "Hi, Ayon!"
        };
        assert.strictEqual(stringify(data, true), getData("literal-object-4"));
    });

    it("should stringify an object and prettify the output with customized spaces as expected", () => {
        let data = {
            abc: "Hello, World!",
            efg: "Hi, Ayon!"
        };
        assert.strictEqual(stringify(data, "    "), getData("literal-object-5"));
    });

    it("should stringify an array as expected", () => {
        let data = ["Hello, World!", "Hi, Ayon!"];
        assert.strictEqual(stringify(data), getData("literal-array-1"));
    });

    it("should stringify an array and prettify the output as expected", () => {
        let data = ["Hello, World!", "Hi, Ayon!"];
        assert.strictEqual(stringify(data, true), getData("literal-array-2"));
    });

    it("should stringify an array and prettify the output with customized spaces as expected", () => {
        let data = ["Hello, World!", "Hi, Ayon!"];
        assert.strictEqual(stringify(data, "    "), getData("literal-array-3"));
    });

    it("should stringify a Map instance as expected", () => {
        let data = new Map([["abc", "Hello, World!"], [{ efg: "Hi, Ayon" }, 1]]);
        assert.strictEqual(stringify(data), getData("compound-map-1"));
    });

    it("should stringify a Map instance and prettify the output as expected", () => {
        let data = new Map([["abc", "Hello, World!"], [{ efg: "Hi, Ayon" }, 1]]);
        assert.strictEqual(stringify(data, true), getData("compound-map-2"));
    });

    it("should stringify a Set instance as expected", () => {
        let data = new Set([["abc", "Hello, World!"], [{ efg: "Hi, Ayon" }, 1]]);
        assert.strictEqual(stringify(data), getData("compound-set-1"));
    });

    it("should stringify a Set instance and prettify the output as expected", () => {
        let data = new Set([["abc", "Hello, World!"], [{ efg: "Hi, Ayon" }, 1]]);
        assert.strictEqual(stringify(data, true), getData("compound-set-2"));
    });

    it("should stringify an Int8Array instance as expected", () => {
        assert.strictEqual(stringify(int8Array), getData("compound-int8array"));
    });

    it("should stringify an Int16Array instance as expected", () => {
        assert.strictEqual(stringify(int16Array), getData("compound-int16array"));
    });

    it("should stringify an Int32Array instance as expected", () => {
        assert.strictEqual(stringify(int32Array), getData("compound-int32array"));
    });

    it("should stringify a Uint8Array instance as expected", () => {
        assert.strictEqual(stringify(uint8Array), getData("compound-uint8array"));
    });

    it("should stringify a Uint16Array instance as expected", () => {
        assert.strictEqual(stringify(uint16Array), getData("compound-uint16array"));
    });

    it("should stringify a Uint32Array instance as expected", () => {
        assert.strictEqual(stringify(uint32Array), getData("compound-uint32array"));
    });

    it("should stringify a Buffer instance as expected", () => {
        assert.strictEqual(stringify(buffer), getData("compound-buffer"));
    });

    it("should stringify an Error instance as expected", () => {
        assert.strictEqual(stringify(error, true), getData("compound-error"));
    });

    it("should stringify an EvalError instance as expected", () => {
        assert.strictEqual(stringify(evalError, true), getData("compound-eval-error"));
    });

    it("should stringify a RangeError instance as expected", () => {
        assert.strictEqual(stringify(rangeError, true), getData("compound-range-error"));
    });

    it("should stringify a ReferenceError instance as expected", () => {
        assert.strictEqual(stringify(referenceError, true), getData("compound-reference-error"));
    });

    it("should stringify a SyntaxError instance as expected", () => {
        assert.strictEqual(stringify(syntaxError, true), getData("compound-syntax-error"));
    });

    it("should stringify a TypeError instance as expected", () => {
        assert.strictEqual(stringify(typeError, true), getData("compound-type-error"));
    });

    it("should stringify an AssertionError instance as expected", () => {
        assert.strictEqual(stringify(assertionError, true), getData("compound-assertion-error"));
    });
});