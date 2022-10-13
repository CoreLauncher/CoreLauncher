//#region Game bar resizing
window.addEventListener(
    "load",
    async function() {
        const Logo = document.getElementById("topbarlogo")
        const GamesList = document.getElementById("topbargameslist")
        const WindowControl = document.getElementById("topbarwindowcontrol")
        async function Resize() {
            GamesList.style.setProperty("--width", `${document.body.offsetWidth - Logo.offsetWidth - WindowControl.offsetWidth - 2}px`)
        }
        addEventListener(
            "resize",
            Resize
        )
        await Resize()
    }
)
//#endregion
//#region GameBar scrolling
window.addEventListener(
    "load",
    async function() {
        const GamesList = document.getElementById("topbargameslist")
        GamesList.addEventListener("wheel", (Event) => {
            Event.preventDefault();
            GamesList.scrollLeft += Event.deltaY;
        });
    }
)
//#endregion
