const Screen = {}

Screen.Show = function(E) {
    E.style.opacity = 1
}

Screen.Hide = function(E) {
    E.style.opacity = 0
    E.style.zIndex = -1
    E.classList.add("hidden")
}

export default Screen