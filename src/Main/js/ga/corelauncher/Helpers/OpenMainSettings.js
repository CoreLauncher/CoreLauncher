return async function OpenMainSettings(DefaultScreen) {
    const Screen = CoreLauncher.ScreenManager.GetScreen("Main.Settings")
    const ScreenData = {
        Title: "Settings",
        Tabs: []
    }

    ScreenData.Tabs.push("Settings")
    ScreenData.Tabs.push(
        {
            Name: "Accounts",
            Screen: "Accounts",
            Data: this
        }
    )

    ScreenData.Tabs.push(
        {
            Name: "Plugins",
            Screen: "Plugins",
            Data: this
        }
    )

    ScreenData.Tabs.forEach((Tab) => { if (typeof Tab != "object") {return}; if (Tab.Screen == DefaultScreen) {Tab.Default = true } });

    await Screen.Hide()
    await Screen.Show(ScreenData)
}