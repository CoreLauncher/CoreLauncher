function LoadProperty(Data, Parent) {
    if (Data.Prefix) {
        const PrefixElement = document.createElement("a")
        PrefixElement.innerText = Data.Prefix
        Parent.appendChild(PrefixElement)
    }

    var Element
    
    if (Data.Type == "Row") {
        Element = document.createElement("div")
        Element.classList.add("row")

        RenderProperties(Data.Properties, Element)
    } else if (Data.Type == "Number") {
        Element = document.createElement("input")
        Element.type = "number"
        if (Data.FillDefault == true) { Element.value = Data.Default }
        Element.placeholder = Data.Default
        if (Data.Placeholder != undefined) { Element.placeholder = Data.Placeholder }

        if (Data.Min != undefined) { Element.min = Data.Min }
        if (Data.Max != undefined) {
            Element.max = Data.Max
            Element.style.width = `${Data.Max.toString().length + 4}ch`
        }

        Element.addEventListener(
            "focusout",
            function () {
                const Value = Number(Element.value)
                if (Value < Data.Min) { Element.value = Data.Min }
                if (Value > Data.Max) { Element.value = Data.Max }
            }
        )
    }

    if (Element) {
        Element.id = `renderedproperty_${Data.Id}`
        Parent.appendChild(Element)
    }

    if (Data.Suffix) {
        const SuffixElement = document.createElement("a")
        SuffixElement.innerText = Data.Suffix
        Parent.appendChild(SuffixElement)
    }
}

function RenderProperties(PropertyList, Parent) {
    for (const Property of PropertyList) {
        LoadProperty(Property, Parent)
    }
}

export default RenderProperties