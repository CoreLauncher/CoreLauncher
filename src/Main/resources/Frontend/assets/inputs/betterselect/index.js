function NewBetterSelect(Element) {
    console.log(Element)
    Element.addEventListener(
        "click",
        () => {
            Element.classList.toggle("expanded")
        }
    )

    const ExpandElement = document.createElement("div")
    ExpandElement.classList.add("expand")
    Element.insertBefore(ExpandElement, Element.firstChild)

    function OnResize() {
        Element.style.setProperty("--select-height", `${Element.offsetHeight}px`)
        Element.style.setProperty("--select-width", `${Element.offsetWidth}px`)
    }
    OnResize()
    new ResizeObserver(OnResize).observe(Element)

    Element.setAttribute("loaded", "")
}

function NewBetterOption(Element) {
    Element.addEventListener(
        "click",
        () => {
            if (Element.getAttribute("selected") == "") { return }
            const SelectElement = Element.parentNode.parentNode
            const CurrentSelected = SelectElement.querySelector("betteroption[selected]")
            if (CurrentSelected) {
                CurrentSelected.removeAttribute("selected")
                Element.parentNode.appendChild(CurrentSelected)
            }

            Element.setAttribute("selected", "")
            SelectElement.setAttribute("value", Element.getAttribute("value"))
            SelectElement.appendChild(Element)
            console.log(CurrentSelected)
        }
    )

    if (Element.getAttribute("selected") == null) {
        Element.parentNode.querySelector("div.expand").appendChild(Element)
    }

    Element.setAttribute("loaded", "")
}

function FindElements(Parent) {
    Parent.querySelectorAll("betterselect:not([loaded])").forEach(NewBetterSelect)
    Parent.querySelectorAll("betteroption:not([loaded])").forEach(NewBetterOption)
}

const Observer = new MutationObserver(
    (MutationRecords) => {
        MutationRecords.forEach(
            (MutationRecord) => {
                MutationRecord.addedNodes.forEach(
                    (Node) => {
                        if (!Node.matches) return
                        if (Node.matches("betterselect:not([loaded])")) { NewBetterSelect(Node) }
                        if (Node.matches("betteroption:not([loaded])")) { NewBetterOption(Node) }
                        FindElements(Node)
                    }
                )
            }
        )
    }
)
Observer.observe(document, { childList: true, subtree: true })

document.addEventListener(
    "DOMContentLoaded",
    () => {
        FindElements(document)
    }
)