module.exports = {
    "env": {
        "node": true,
        "jasmine": true,
        "protractor": true,
    },

    "globals": {
    },

    "extends": "eslint:recommended",

    "rules": {
        "indent": [
            "error",
            4,
            {
              "VariableDeclarator": 1,
              "MemberExpression": 0
            }
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off"
    }
};
