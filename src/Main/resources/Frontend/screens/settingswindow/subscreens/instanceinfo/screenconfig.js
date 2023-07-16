const Screen = {}

var GameId
var InstanceId
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
            console.log(`Property ${Property.Id} changed to ${Element.getAttribute("value")}`)

            await CoreLauncher.GameManager.SetInstanceProperties(
                GameId,
                CoreLauncher.Properties.Collect(
                    PropertyList,
                    PropertiesHolder
                )
            )
        },
        await CoreLauncher.GameManager.GetInstanceProperties(GameId, InstanceId)
    )
    
}

export default Screen