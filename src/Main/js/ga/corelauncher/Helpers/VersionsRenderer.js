let VersionTemplate = `
    <div class="renderedversionselector empty">
        <div class="nameholder">
            <a class="name">Version Name</a>
        </div>
        <div class="versions">
        </div>
        <div class="loadingimage">
            <img src="/assets/image/ico-nopad.gif">
        </div>
        <div class="emptyindicator">
            <a class="emptytext">←</a>
        </div>
        <div class="lockedindicator">
            <img src="/assets/image/ico/lock.svg" alt="">
            <a class="lockedtext">Version is locked</a>
        </div>
    </div>
`

const HtmlParser = new DOMParser()
VersionTemplate = HtmlParser.parseFromString(VersionTemplate, "text/html").body.firstChild

const DeSVG = await Import("ga.corelauncher.Helpers.DeSVG")
DeSVG(VersionTemplate)

class VersionsRenderer {
    static async RenderVersions(Holder, Versions, PreSelect = {}, OnChange = () => {}) {
        Holder.innerHTML = ""
        Holder.classList.add("renderedversionselectorholder")

        for (const Version of Versions) {
            const VersionElement = VersionTemplate.cloneNode(true)
            VersionElement.querySelector(".name").innerText = Version.Name
            VersionElement.setAttribute("versionselectorid", Version.Id)
            Holder.appendChild(VersionElement)
        }

        this.RenderVersionSelector(Holder, Versions[0], PreSelect, Versions, OnChange)
    }

    static async RenderVersionSelector(Holder, Version, PreSelect, Versions, OnChange) {
        const SelectorElement = Holder.querySelector(`[versionselectorid="${Version.Id}"]`)

        SelectorElement.classList.remove("empty")
        SelectorElement.classList.remove("loaded")
        SelectorElement.classList.add("loading")

        const VersionEntryHolderElement = SelectorElement.querySelector(".versions")
        VersionEntryHolderElement.innerHTML = ""

        const VersionValues = await Version.ObtainValues(await this.GetVersionValues(Holder))
        for (const VersionId in VersionValues) {
            const VersionName = VersionValues[VersionId]

            const VersionEntryElement = document.createElement("a")
            VersionEntryElement.classList.add("versionentry")
            VersionEntryElement.innerText = VersionName
            VersionEntryHolderElement.appendChild(VersionEntryElement)

            VersionEntryElement.addEventListener(
                "click",
                async () => {
                    const SelectedVersion = VersionEntryHolderElement.querySelector(".selected")
                    if (SelectedVersion) { SelectedVersion.classList.remove("selected") }
                    VersionEntryElement.classList.add("selected")
                    SelectorElement.setAttribute("value", VersionId)

                    OnChange(VersionId, Version.Id, VersionName, Version)

                    const NextVersion = Versions[Versions.indexOf(Version) + 1]
                    if (!NextVersion) { return }
                    await this.ClearSelectorsAfter(Holder, Version, Versions)
                    await this.RenderVersionSelector(Holder, NextVersion, PreSelect, Versions, OnChange)
                }
            )

            if (PreSelect[Version.Id] == VersionId) {
                VersionEntryElement.click()
            }
        }

        SelectorElement.classList.remove("loading")
        if (PreSelect[Version.Id] && !Version.Editable) {
            SelectorElement.querySelector(".lockedtext").innerText = `Version is locked to ${PreSelect[Version.Id]}. Create a new instance to change it.`
            SelectorElement.classList.add("locked")
        } else {
            SelectorElement.classList.add("loaded")
        }
    }

    static async ClearSelectorsAfter(Holder, Version, Versions) {
        const VersionSelectors = Holder.querySelectorAll(".renderedversionselector")
        let Clear = false
        for (const VersionSelector of VersionSelectors) {
            if (Clear) {
                await this.ClearSelector(VersionSelector)
            }
            if (VersionSelector.getAttribute("versionselectorid") == Version.Id) {
                Clear = true
            }
        }
    }

    static async ClearSelector(Element) {
        const VersionEntryHolderElement = Element.querySelector(".versions")
        VersionEntryHolderElement.innerHTML = ""
        Element.removeAttribute("value")
        Element.classList.remove("loaded")
        Element.classList.add("empty")
    }

    static async GetVersionElements(Holder) {
        const VersionElements = {}
        const VersionSelectors = Holder.querySelectorAll(".renderedversionselector")
        for (const VersionSelector of VersionSelectors) {
            const VersionId = VersionSelector.getAttribute("versionselectorid")
            VersionElements[VersionId] = VersionSelector
        }
        return VersionElements
    }

    static async GetVersionValues(Holder) {
        const VersionValues = {}
        const VersionElements = await this.GetVersionElements(Holder)
        for (const VersionId in VersionElements) {
            const VersionElement = VersionElements[VersionId]
            VersionValues[VersionId] = VersionElement.getAttribute("value")
        }
        return VersionValues
    }
}

return VersionsRenderer