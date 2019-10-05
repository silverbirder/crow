module.exports = {
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js"
    ],
    "preset": "jest-puppeteer",
    "transform": {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    "globals": {
        "ts-jest": {
            "tsConfigFile": "tsconfig.json"
        }
    },
    "testMatch": [
        "**/__tests__/*.+(ts|tsx|js)"
    ]
};