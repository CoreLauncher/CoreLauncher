const Screen = {}

Screen.Init = async function(ScreenElement, Screen) {
    var PluginTemplate = ScreenElement.querySelector(".pluginitem")
    PluginTemplate.remove()

    const PluginsContainer = ScreenElement.querySelector(".pluginscontainer")
    PluginsContainer.innerHTML = ""

    const PluginIds = await CoreLauncher.PluginManager.ListPluginIds()
    for (const PluginId of PluginIds) {
        console.log(PluginId)
        const Plugin = await CoreLauncher.PluginManager.GetPluginInformation(PluginId)
        const PluginElement = PluginTemplate.cloneNode(true)

        PluginElement.querySelector(".name").innerText = Plugin.Name
        PluginElement.querySelector(".icon").src = await CoreLauncher.PluginManager.GetPluginIconBase64(PluginId)
        PluginElement.querySelector(".createdby").innerText = `by ${Plugin.Creator}`
        PluginElement.querySelector(".version").innerText = Plugin.Version
        PluginElement.querySelector(".description").innerText = Plugin.Description

        PluginElement.querySelector(".creator").addEventListener(
            "click",
            () => {
                CoreLauncher.WindowControl.OpenExternal(Plugin.CreatorLink)
            }
        )

        PluginElement.querySelector(".source").addEventListener(
            "click",
            () => {
                CoreLauncher.WindowControl.OpenExternal(Plugin.Source)
            }
        )

        PluginsContainer.appendChild(PluginElement)
    }

    const IsMultipleLoaded = PluginIds.length > 1
    ScreenElement.querySelector(".title").innerText = `There ${IsMultipleLoaded ? "are" : "is"} currently ${PluginIds.length} ${IsMultipleLoaded ? "plugins" : "plugin"} installed`
}

export default Screen