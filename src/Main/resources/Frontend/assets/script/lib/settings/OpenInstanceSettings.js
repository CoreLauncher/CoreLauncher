async function OpenInstanceSettings(GameId, InstanceId) {
    const SettingsData = {}
    SettingsData.ReturnScreen = {
        Screen: CoreLauncher.ScreenManager.GetScreen("settingswindow"),
        Data: await CoreLauncher.Settings.OpenGameSettings(GameId, false, true)
    }

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