let PluginTemplate

return {
    Default: false,

    Init: async function(Screen, ScreenElement, ScreenManager, Data) {
        PluginTemplate = ScreenElement.querySelector(".plugin")
        PluginTemplate.remove()
    },

    ApplyShowStyle: true,
    Show: async function(Screen, ScreenElement, ScreenManager, Data) {
        ScreenElement.innerHTML = ""
        for (const Plugin of CoreLauncher.ListPlugins()) {
            const PluginElement = PluginTemplate.cloneNode(true)
            PluginElement.querySelector(".icon").src = Plugin.GetIconBase64()
            PluginElement.querySelector(".name").innerText = Plugin.Name
            PluginElement.querySelector(".creator").innerText = Plugin.Creator
            PluginElement.querySelector(".description").innerText = Plugin.Description
            PluginElement.querySelector("#sourcebutton").addEventListener("click", () => { nw.Shell.openExternal(Plugin.Source) })
            PluginElement.querySelector("#creatorbutton").addEventListener("click", () => { nw.Shell.openExternal(Plugin.CreatorLink) })
            ScreenElement.appendChild(PluginElement)
        }
    },
    
    ApplyHideStyle: true,
    Hide: async function(Screen, ScreenElement, ScreenManager, Data) {

    }
}