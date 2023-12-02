return async function OpenMainSettings() {
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

    await Screen.Hide()
    await Screen.Show(ScreenData)
}