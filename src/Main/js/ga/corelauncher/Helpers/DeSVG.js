function ElementFromXml(Xml) {
    const Div = document.createElement("div")
    Div.innerHTML = Xml
    return Div.firstChild
}

async function ReplaceImage(ImageTag, SvgUrl) {
    const Response = await fetch(SvgUrl)
    const Svg = await Response.text()
    const SvgElement = ElementFromXml(Svg)
    SvgElement.setAttribute("src", SvgUrl)
    SvgElement.querySelectorAll("[fill]").forEach(Element => Element.removeAttribute("fill"))
    ImageTag.getAttribute("class") ? SvgElement.setAttribute("class", ImageTag.getAttribute("class")) : null
    ImageTag.replaceWith(SvgElement)
}

async function DeSVG(SelectorParent = document) {
    const ImageTags = Array.from(SelectorParent.querySelectorAll('img[src*=".svg"]'))
    const Promises = ImageTags.map(ImageTag => { ReplaceImage(ImageTag, ImageTag.src) })
    await Promise.all(Promises)
}

return DeSVG