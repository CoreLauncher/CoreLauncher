async function OpenInstanceSettings(GameId, InstanceId) {
    const SettingsData = {}
    SettingsData.Tabs = []

    const InstanceSettingsGroup = {
        Name: "Instance Settings",
        Tabs: [
            {
                Name: "Information",
                Screen: "instanceinfo",
                Data: [
                    GameId,
                    InstanceId
                ]
            }
        ]
    }
    SettingsData.Tabs.push(InstanceSettingsGroup)

    CoreLauncher.ScreenManager.GetScreen("settingswindow").Show(false, SettingsData)
}

export default OpenInstanceSettings