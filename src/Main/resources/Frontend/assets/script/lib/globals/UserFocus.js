async function UserFocus(Element, Time=0.3, FocusSize=20, ColorR, ColorG, ColorB) {
    const FocusElement = document.createElement("div")
    FocusElement.classList.add("userfocus")

    FocusElement.style.setProperty("--parenttop", Element.offsetTop + 30 + "px")
    FocusElement.style.setProperty("--parentleft", Element.offsetLeft + "px")
    FocusElement.style.setProperty("--parentwidth", Element.offsetWidth + "px")
    FocusElement.style.setProperty("--parentheight", Element.offsetHeight + "px")

    let BackgroundColor
    if (!ColorR) {
        BackgroundColor = window.getComputedStyle(Element).getPropertyValue("background-color")
    } else {
        BackgroundColor = `rgb(${ColorR}, ${ColorG}, ${ColorB})`
    }
    FocusElement.style.setProperty("--background-color", BackgroundColor)

    FocusElement.style.setProperty("--time", Time + "s")
    FocusElement.style.setProperty("--focus-size", FocusSize + "px")

    const InnerFocusElement = document.createElement("div")
    InnerFocusElement.classList.add("innerfocus")
    FocusElement.appendChild(InnerFocusElement)

    document.body.appendChild(FocusElement)

    await sleep(100)
    FocusElement.classList.add("focus")
    await sleep(Time * 1000)
    FocusElement.remove()
}

globalThis.UserFocus = UserFocus
export default UserFocus