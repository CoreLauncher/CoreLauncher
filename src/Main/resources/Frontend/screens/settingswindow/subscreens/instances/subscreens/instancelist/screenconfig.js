const Screen = {}

let GameId
let InstanceList
let InstanceTemplate
Screen.Init = function (ScreenElement, Screen) {
    InstanceList = ScreenElement.querySelector(".instancelist")
    InstanceTemplate = ScreenElement.querySelector(".instance")
    InstanceTemplate.remove()

    ScreenElement.querySelector(".createinstancebutton").addEventListener(
        "click",
        function () {
            Screen.ParentScreen.GetScreen("createinstance").Show(false, GameId)
        }
    )
}

Screen.Show = async function (ScreenElement, Screen, Data) {
    GameId = Data

    InstanceList.innerHTML = ""

    const Instances = await CoreLauncher.GameManager.ListInstances(GameId)
    for (const Instance of Instances) {
        const InstanceElement = InstanceTemplate.cloneNode(true)
        InstanceElement.querySelector(".name").innerText = Instance.Name
        InstanceElement.querySelector(".icon").src = await CoreLauncher.GameManager.GetGameIconBase64(GameId)

        InstanceElement.querySelector(".settingsbutton").addEventListener(
            "click",
            function () {
                CoreLauncher.Settings.OpenInstanceSettings(GameId, Instance.UUID)
            }
        )
        
        InstanceList.appendChild(InstanceElement)
    }
}

export default Screen