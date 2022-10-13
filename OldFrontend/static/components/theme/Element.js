class ThemeSwitcher extends HTMLElement {
    constructor() {
        super()
        
    }

    connectedCallback() {
        const Shadow = this.attachShadow({mode: 'open'});
        this.style.height = "30px"
        this.style.width = "60px"
        this.style.display = "block"
        const Iframe = document.createElement('iframe');
        Iframe.src = '/static/components/theme/index.html';
        Iframe.setAttribute("frameborder", 0)
        Iframe.style.height = "100%"
        Iframe.style.width = "100%"
        Shadow.appendChild(Iframe);
    }
}

try {customElements.define('theme-switcher', ThemeSwitcher)} catch {}
console.log("Loaded Theme")