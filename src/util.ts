import get = require("lodash/get");

/** Whether the current environment is NodeJS. */
export const IsNode = typeof global === "object"
    && get(global, "process.release.name") === "node";

/** The pattern that matches valid JavaScript Latin variable names. */
export const LatinVar = /^[a-z_\$][a-z0-9_\$]*$/i;
export const LatinVar2 = /^[a-z_\$][a-z0-9_\$]*/i;

/** Gets the values in the given iterable object. */
export function values<T>(data: Iterable<T> | { [x: string]: T }) {
    let arr: T[] = [];

    if (typeof data[Symbol.iterator] === "function") {
        for (let item of (<Iterable<T>>data)) {
            arr.push(item);
        }
    } else {
        for (let key in data) {
            arr.push(data[key]);
        }
    }

    return arr;
}

/**
 * Normalizes the given path, resolving '..' and '.' segments, and change path
 * separators to platform preference.
 */
export function normalize(path: string): string {
    let parts = path.split(/\/|\\/),
        sep = IsNode ? "/" : (process.platform == "win32" ? "\\" : "/");

    for (let i = 0; i < parts.length; i++) {
        if (parts[i] == "..") {
            parts.splice(i - 1, 2);
            i -= 2;
        } else if (parts[i] == ".") {
            parts.splice(i, 1);
            i -= 1;
        }
    }

    return parts.join(sep);
}

/**
 * Matches the reference notation in the form of `$.a.b.c` where `$` stands for
 * the current object.
 */
export function matchRefNotation(str: string) {
    if (str[0] !== "$") {
        return null;
    }

    let value = "$" + resolvePropPath(str.slice(1));

    return {
        value,
        offset: 0,
        length: value.length,
        source: str,
    };
}

function resolvePropPath(str: string) {
    let prop = str[0];

    if (prop === "[") {
        let end = str.indexOf("]");

        if (end === -1) {
            return "";
        } else {
            prop += str.slice(1, end + 1);
            str = str.slice(end + 1);
        }
    } else if (prop === ".") {
        str = str.slice(1);
        let matches = str.match(LatinVar2);

        if (!matches) {
            return "";
        } else {
            prop += matches[0];
            str = str.slice(matches[0].length);
        }
    } else {
        return "";
    }

    return prop + resolvePropPath(str);
}