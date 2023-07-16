async function OpenGameSettings(Game) {
    const SettingsData = {}
    SettingsData.Tabs = []

    const GameSettingsGroup = {
        Name: "Game Settings",
        Tabs: [
            {
                Name: "Game Information",
                Screen: "gameinfo",
                Data: [Game.Id]
            }
        ]
    }
    SettingsData.Tabs.push(GameSettingsGroup)

    if (Game.UsesInstances) {
        GameSettingsGroup.Tabs.push(
            {
                Name: "Instances",
                Screen: "instances",
                Data: [Game.Id]
            }
        )
    }

    CoreLauncher.ScreenManager.GetScreen("settingswindow").Show(false, SettingsData)
}

export default OpenGameSettings