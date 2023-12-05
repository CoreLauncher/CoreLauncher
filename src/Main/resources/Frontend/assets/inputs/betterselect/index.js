function NewBetterSelect(Element) {
    console.log(Element)
    Element.addEventListener(
        "click",
        () => {
            Element.classList.toggle("expanded")
        }
    )

    Element.setAttribute("loaded", "")
}

function NewBetterOption(Element) {
    Element.addEventListener(
        "click",
        () => {

        }
    )

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