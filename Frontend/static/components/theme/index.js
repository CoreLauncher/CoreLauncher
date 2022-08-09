window.addEventListener(
    "load",
    async function() {
        const SliderHolder = document.getElementById("theme-slider-holder")
        const ThemeSlider = document.getElementById("theme-slider")
        ThemeSlider.classList.add(localStorage.Theme)
        SliderHolder.addEventListener(
            "click",
            async function() {
                ThemeSlider.classList.toggle("dark")
                ThemeSlider.classList.toggle("light")
                localStorage.Theme = ThemeSlider.classList[1]
                window.dispatchEvent(new Event("themechange"))
            }
        )
    }
)