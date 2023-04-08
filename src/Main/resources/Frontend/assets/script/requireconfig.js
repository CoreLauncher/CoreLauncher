requirejs.config(
    {
        baseUrl: `${location.origin}/assets/script/`,
        paths: {},
    }
)

require(
    ['ext/domReady'],
    function () {
        console.log("DOM is ready")
        require(["index"], function() {})
    }
)