const Html = document.documentElement
const Change = function() {
    Html.setAttribute("class", `theme-${localStorage.Theme}`)
}

Change()

window.addEventListener(
    "storage",
    function(Data) {
        if (Data.key == "Theme") {
            Change()
        }
    }
)

window.addEventListener("themechange", Change)