const Html = document.documentElement
console.log(Html)
const Change = function() {
    Html.setAttribute("class", `theme-${localStorage.Theme}`)
}

Change()

window.addEventListener(
    "storage",
    function(Data) {
        console.log(Html)
        console.log(Data)
        if (Data.key == "Theme") {
            Change()
        }
    }
)

window.addEventListener("themechange", Change)