requirejs.config(
    {
        baseUrl: "/assets/script/",
        paths: {
            "CoreLauncher": "./",
        }
    }
)

console.log(1)
requirejs(["CoreLauncher/index.js"], function() {})