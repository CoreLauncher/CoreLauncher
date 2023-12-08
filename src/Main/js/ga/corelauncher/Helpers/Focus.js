async function Focus(Element, Time, Color) {
    const FocusElement = document.createElement("div")
    FocusElement.classList.add("focus")
    FocusElement.style.setProperty("--color", Color)
    FocusElement.style.animationDuration = `${Time}ms`

    const Interval = setInterval(
        () => {
            const PositionData = Element.getBoundingClientRect()
            FocusElement.style.top = `${PositionData.top}px`
            FocusElement.style.left = `${PositionData.left}px`
            FocusElement.style.width = `${PositionData.width}px`
            FocusElement.style.height = `${PositionData.height}px`
        },
        1
    )

    document.body.appendChild(FocusElement)

    await Sleep(Time)
    // FocusElement.remove()
    clearInterval(Interval)
}

return Focus