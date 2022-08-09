class Topbar extends HTMLElement {
    constructor() {
        super()
        
    }

    connectedCallback() {
        const Shadow = this.attachShadow({mode: 'open'});
        this.style.height = "100px"
        this.style.width = "100%"
        this.style.display = "block"
        const Iframe = document.createElement('iframe');
        Iframe.src = '/static/components/topbar/index.html';
        Iframe.setAttribute("frameborder", 0)
        Iframe.style.height = "100%"
        Iframe.style.width = "100%"
        Shadow.appendChild(Iframe);
    }
}

try {customElements.define('top-bar', Topbar)} catch {}
console.log("Loaded Topbar")