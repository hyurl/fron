const { stringify } = require("../dist/stringify");
const { register } = require("../dist/index");

class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    toFRON() {
        return Object.assign({}, this);
    }
}

register(User);

var data = {
    "hello world!": "Hello,\tWorld!",
    hi: ["Hello, World!", "Hi, FRON"],
    date: new Date(),
    num: 12345,
    num2: new Number(12345),
    err: Object.assign(new TypeError("something went wrong"), { code: 500 }),
    bool: true,
    bool2: new Boolean(false),
    map: new Map([["a", 1], ["b", 2]]),
    set: new Set([["a"], ["b"]]),
    nul: null,
    symbol: Symbol.for("hello"),
    fn: () => { },
    buf: Buffer.from("hello, world!"),
    re: new RegExp("\\\\[a-z]", 'i'),
    obj: { hello: "world!" },
    arr: [],
    user: new User("Ayon Lee", 23)
};
data["obj2"] = data;
data.obj["ha"] = {};
data.obj["ha"]["ha"] = data;
data.obj["ha ha"] = data.obj;
data.obj["ha ha ha"] = {};
data.obj["ha ha ha"]["depth"] = {
    cir: data.obj["ha ha ha"]
};

console.log(stringify(data.obj, false));