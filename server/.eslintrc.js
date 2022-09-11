module.exports = {
    "env": {
        "browser": false,
        "commonjs": true,
        "node": true,
        "es2021": true
    },
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
        "no-undef": "error"
    }
}
