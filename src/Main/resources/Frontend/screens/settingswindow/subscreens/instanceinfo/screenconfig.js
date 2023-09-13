const Screen = {}

var GameId
var InstanceId
Screen.Init = async function(ScreenElement, Screen) {
    ScreenElement.querySelector(".deletebutton").addEventListener(
        "click",
        async function() {
            await CoreLauncher.GameManager.RemoveInstance(GameId, InstanceId)
            CoreLauncher.Settings.OpenGameSettings(GameId, true, true)
        }
    )

    ScreenElement.querySelector(".instancetitle").addEventListener(
        "change",
        async function() {
            await CoreLauncher.GameManager.SetInstanceName(GameId, InstanceId, this.value)
        }
    )
}

Screen.Show = async function(ScreenElement, Screen, Data) {
    GameId = Data[0]
    InstanceId = Data[1]
    console.log(GameId, InstanceId, Data)

    const InstanceData = await CoreLauncher.GameManager.GetInstance(GameId, InstanceId)
    console.log(InstanceData)

    ScreenElement.querySelector(".instancetitle").value = InstanceData.Name

    CoreLauncher.Properties.Render(
        await CoreLauncher.GameManager.ListInstanceProperties(GameId),
        ScreenElement.querySelector(".propertiesholder"),
        async function(Property, PropertyList, Element, PropertiesHolder) {
            console.log(`Property ${Property.Id} changed to ${Element.value}`)

            await CoreLauncher.GameManager.SetInstanceProperties(
                GameId,
                InstanceId,
                CoreLauncher.Properties.Collect(
                    PropertyList,
                    PropertiesHolder
                )
            )
        },
        await CoreLauncher.GameManager.GetInstanceProperties(GameId, InstanceId, false)
    )
    
}

export default Screen