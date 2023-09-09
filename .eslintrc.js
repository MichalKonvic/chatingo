module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "react",
        "@next/eslint-plugin-next"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        "react/jsx-max-props-per-line": [1, { "maximum": 1, "when": "always" }],
        "react/jsx-indent": [1, 2, { checkAttributes: true }],
    }
}
