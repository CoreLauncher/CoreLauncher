async function OpenSettings() {
    const SettingsData = {}
    SettingsData.Tabs = [
        {
            Name: "General",
            Tabs: [
                {
                    Name: "Plugins",
                    Screen: "plugins"
                },
                {
                    Name: "Accounts",
                    Screen: "accounts"
                }
            ]
        },
        {
            Name: "About",
            Tabs: [
                {
                    Name: "About CoreLauncher",
                    Screen: "about"
                },
                {
                    Name: "Change Log",
                    Screen: "changelog"
                }
            ]
        }
    ]

    CoreLauncher.ScreenManager.GetScreen("settingswindow").Show(false, SettingsData)
}

export default OpenSettings