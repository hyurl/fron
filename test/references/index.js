require("source-map-support/register");
const assert = require("assert");
const { stringify, parse, parseToken } = require("../..");
const { createGetter } = require("../utils");
const get = createGetter(__dirname);

var regularReference = {
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
regularReference.def = regularReference.abc;
regularReference.ghi = regularReference.abc.prop2;
regularReference.abc.prop2.push(regularReference.abc.prop2[1]);

var circularReference = {
    abc: {
        prop1: "Hello, World",
        prop2: [
            "Hi, Ayon"
        ]
    }
};
circularReference.def = circularReference;
circularReference.abc.prop3 = circularReference.abc;
circularReference.abc.prop2.push(circularReference.abc.prop2);

var referenceWithWrapper = {
    a: {},
    b: 123
};
referenceWithWrapper.a.c = referenceWithWrapper.a;

describe("Stringify References", () => {
    it("should stringify an object with regular references as expected", () => {
        assert.strictEqual(stringify(regularReference, true), get("regular"));
    });

    it("should stringify an object with circular references as expected", () => {
        assert.strictEqual(stringify(circularReference, true), get("circular"));
    });
});

describe("Parse References", () => {
    it("should parse an object with regular references as expected", () => {
        assert.deepStrictEqual(parse(get("regular")), regularReference);
    });

    it("should parse an object with circular references as expected", () => {
        let nodeVersion = parseInt(process.version.slice(1));
        if (nodeVersion > 8) {
            assert.deepStrictEqual(parse(get("circular")), circularReference);
        }
    });

    it("should parse an object with Reference compound type as expected", () => {
        assert.deepStrictEqual(parse(get("compound")), regularReference);
    });

    it("should parse an object with reference and wrapper type as expected", () => {
        assert.strictEqual(stringify(parse(get("with-wrapper"))), stringify(referenceWithWrapper));
    });

    it("should parse an complicated object with reference and wrapper type as expected", () => {
        let token = parseToken("{a:123}");
        let str = stringify(token);
        let str2 = stringify(token).replace(/[a-zA-Z0-9]+\(/g, "").replace(/\}\)/g, "}");
        assert.strictEqual(stringify(parse(str)), stringify(parse(str2)));
    });
});