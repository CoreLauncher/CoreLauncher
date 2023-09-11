async function OpenGameSettings(GameId, Show=true) {
    const SettingsData = {}
    SettingsData.Tabs = []

    const Game = await CoreLauncher.GameManager.GetGame(GameId)

    const GameSettingsGroup = {
        Name: "Game Settings",
        Tabs: [
            {
                Name: "Game Information",
                Screen: "gameinfo",
                Data: [GameId]
            }
        ]
    }
    SettingsData.Tabs.push(GameSettingsGroup)

    if (Game.UsesInstances) {
        GameSettingsGroup.Tabs.push(
            {
                Name: "Instances",
                Screen: "instances",
                Data: [GameId]
            }
        )
    }

    if (Show) {
        CoreLauncher.ScreenManager.GetScreen("settingswindow").Show(false, SettingsData)
    }

    return SettingsData
}

export default OpenGameSettings