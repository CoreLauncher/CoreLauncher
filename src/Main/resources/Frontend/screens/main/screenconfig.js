const Screen = {}

Screen.Init = function(ScreenElement) {
    const HoverLine = ScreenElement.querySelector('.dragline')
    const Names = ScreenElement.querySelector('.names')
    var Dragging = false
    const MinWidth = 200

    HoverLine.addEventListener('mousedown', function() {
        Dragging = true
    })

    document.addEventListener('mouseup', function() {
        Dragging = false
    })

    document.addEventListener('mousemove', function(e) {
        if (Dragging) {
            var Width = e.clientX - 30
            if (Width < MinWidth) {
                Width = 0
            } else {
                Width = Math.clamp(Width, MinWidth, 500)
            }
            Names.style.width = `${Width}px`
        }
    })
}

export default Screen