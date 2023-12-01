const PropertiesRenderer = {}

const MarkdownRenderer = await Import("ga.corelauncher.Helpers.MarkdownRenderer")

function RenderProperty(PropertyData, FillData, RowElement) {
    if (PropertyData.Prefix) {
        const PrefixElement = document.createElement("a")
        PrefixElement.classList.add("prefix")
        console.log(MarkdownRenderer(PropertyData.Prefix))
        PrefixElement.innerHTML = MarkdownRenderer(PropertyData.Prefix)
        RowElement.appendChild(PrefixElement)
    }

    let Element

    if (PropertyData.Type == "Number") {
        Element = document.createElement("input")
        Element.type = "number"
        Element.placeholder = PropertyData.Default
        if (PropertyData.FillDefault) { Element.value = PropertyData.Default }
        if (PropertyData.PlaceHolder != undefined) { Element.placeholder = PropertyData.PlaceHolder }
        if (PropertyData.Min != undefined) { Element.min = PropertyData.Min }
        if (PropertyData.Max != undefined) {
            Element.max = PropertyData.Max
            Element.style.width = `${PropertyData.Max.toString().length + 4}ch`
        }
    } else if (PropertyData.Type == "Boolean") {
        Element = document.createElement("div")
        Element.classList.add("switchinput")
        Element.setAttribute(
            "onclick",
            `this.setAttribute('value', ( this.getAttribute('value') == 'true' ? 'false' : 'true' )); const ChangeEvent = new Event('change'); this.dispatchEvent(ChangeEvent);`
        )
        if (PropertyData.FillDefault == true && PropertyData.Default == true) { Element.click() }
    }

    if (Element) {
        if (FillData[PropertyData.Id] != undefined) { Element.setAttribute("value", FillData[PropertyData.Id]) }
        Element.id = `renderedproperty_${PropertyData.Id}`
        RowElement.appendChild(Element)
    }

    if (PropertyData.Suffix) {
        const SuffixElement = document.createElement("a")
        SuffixElement.innerHTML = MarkdownRenderer(PropertyData.Suffix)
        Parent.appendChild(SuffixElement)
    }

    return Element
}

PropertiesRenderer.Render = function Render(HolderElement, Properties, FillData, OnChange) {
    for (const Row of Properties) {
        const RowElement = document.createElement("div")
        RowElement.classList.add("propertyrow")
        HolderElement.appendChild(RowElement)
        for (const Property of Row) {
            RenderProperty(Property, FillData, RowElement)
        }
    }
}

return PropertiesRenderer