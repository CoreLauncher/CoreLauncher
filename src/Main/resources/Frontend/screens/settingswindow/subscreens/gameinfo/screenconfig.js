const Screen = {}

var GameId
Screen.Show = async function(ScreenElement, Screen, Data) {
    GameId = Data

    const Game = await CoreLauncher.GameManager.GetGame(GameId)

    ScreenElement.querySelector(".gametitle").innerText = Game.Name
    ScreenElement.querySelector(".gamedescription").innerText = Game.Description

    CoreLauncher.Properties.Render(
        await CoreLauncher.GameManager.ListGameProperties(GameId),
        ScreenElement.querySelector(".propertiesholder"),
        async function(Property, PropertyList, Element, PropertiesHolder) {
            console.log(`Property ${Property.Id} changed to ${Element.getAttribute("value")}`)

            await CoreLauncher.GameManager.SetGameProperties(
                GameId,
                CoreLauncher.Properties.Collect(
                    PropertyList,
                    PropertiesHolder
                )
            )
        },
        await CoreLauncher.GameManager.GetGameProperties(GameId, false)
    )
}

export default Screen