requirejs.config(
    {
        baseUrl: `${location.origin}/assets/script/`,
        paths: {},
    }
)

console.log(1)
require(["index"], function() {})
