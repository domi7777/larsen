module.exports = {
    env: {
        es6: true,
        node: false,
        browser: true,
    },
    extends: "eslint:recommended",
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: "module",
    },
    rules: {
        indent: ["error", 2],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        "no-console": "off",
        "no-unused-vars": "off",
        "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
        "@typescript-eslint/no-unused-vars": [
            "error",
            {vars: "all", args: "after-used", ignoreRestSiblings: false},
        ],
        "@typescript-eslint/explicit-function-return-type": "off", // Consider using explicit annotations for object literals and function return types even when they can be inferred.
        "no-empty": "warn",
    },
};
