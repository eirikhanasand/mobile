module.exports = function(api) {
    api.cache(true)

    return {
        presets: [
            'babel-preset-expo',
        ],
        plugins: [
            ["module-resolver", {
                "alias": {
                    "@components": "./src/components",
                    "@themes": "./src/themes",
                    "@assets": "./public/assets",
                    "@text": "./public/text",
                    "@screens": "./src/screens",
                    "@utils": "./src/utils",
                    "@constants": "./constants",
                    "@shared": "./src/shared",
                    "@styles": "./src/styles",
                    "@redux": "./src/redux",
                    "@nav": "./src/components/nav",
                    "@hooks": "./src/hooks",
                    "@": "./src/",
                }
            }],
            ["babel-plugin-inline-import", {
                "extensions": [".svg"]
            }],
        ],
    }
}