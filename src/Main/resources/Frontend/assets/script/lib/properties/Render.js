function LoadProperty(Data, Parent) {
    if (Data.Prefix) {
        const PrefixElement = document.createElement("a")
        PrefixElement.innerHTML = CoreLauncher.HtmlHelper.CoreLauncherMarkdown(Data.Prefix)
        Parent.appendChild(PrefixElement)
    }

    var Element

    if (Data.Type == "Number") {
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
    } else if (Data.Type == "Boolean") {
        Element = document.createElement("div")
        Element.classList.add("switchinput")
        Element.setAttribute("onclick", "this.dataset.value=( this.dataset.value == 'true' ? 'false' : 'true' ); const ChangeEvent = new Event('change'); this.dispatchEvent(ChangeEvent);")
        if (Data.FillDefault == true && Data.Default == true) { Element.click() }
    }

    if (Element) {
        Element.id = `renderedproperty_${Data.Id}`
        Parent.appendChild(Element)
    }

    if (Data.Suffix) {
        const SuffixElement = document.createElement("a")
        SuffixElement.innerHTML = CoreLauncher.HtmlHelper.CoreLauncherMarkdown(Data.Suffix)
        Parent.appendChild(SuffixElement)
    }

    return Element
}

function RenderProperties(PropertyList, Parent, OnChange) {
    for (const PropertyRow of PropertyList) {
        const RowElement = document.createElement("div")
        RowElement.classList.add("row")
        Parent.appendChild(RowElement)

        for (const Property of PropertyRow) {
            const Element = LoadProperty(Property, RowElement, OnChange)
            if (OnChange) {
                Element.addEventListener(
                    "change",
                    function () {
                        OnChange(Property, Element)
                    }
                )
            }
        }
    }
}

export default RenderProperties