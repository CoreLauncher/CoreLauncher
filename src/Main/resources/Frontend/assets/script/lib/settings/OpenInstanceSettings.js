async function OpenInstanceSettings(GameId, InstanceId) {
    const SettingsData = {}
    SettingsData.ReturnScreen = {
        Screen: CoreLauncher.ScreenManager.GetScreen("settingswindow"),
        Data: await CoreLauncher.Settings.OpenGameSettings(GameId)
    }

    for (const Group of SettingsData.ReturnScreen.Data.Tabs) {
        for (const Tab of Group.Tabs) {
            if (Tab.Screen == "instances") {
                Tab.Default = true
            }
        }
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