const Screen = {}

var GameId
Screen.Show = async function(ScreenElement, Screen, Data) {
    GameId = Data

    const Game = await CoreLauncher.GameManager.GetGame(GameId)

    ScreenElement.querySelector(".gametitle").innerText = Game.Name
    ScreenElement.querySelector(".gamedescription").innerText = Game.Description

    const GameProperties = await CoreLauncher.GameManager.ListGameProperties(GameId)

    const PropertiesHolder = ScreenElement.querySelector(".propertiesholder")
    PropertiesHolder.innerHTML = ""
    CoreLauncher.Properties.Render(
        GameProperties,
        PropertiesHolder,
        async function(Property) {
            console.log(CoreLauncher.Properties.Collect(GameProperties, PropertiesHolder))
            await CoreLauncher.GameManager.SetGameProperties(GameId, CoreLauncher.Properties.Collect(GameProperties, PropertiesHolder))
        }
    )
}

export default Screen