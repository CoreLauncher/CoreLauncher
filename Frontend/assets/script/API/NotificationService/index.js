const NotificationService = {}

function Container() {
    return document.getElementById("container")
}
function NotificationLabel() {
    return document.getElementById("notificationlabel")
}
function NotificationFrame() {
    p("load")
    return document.getElementById("notiframe")
}

var ShownNotification
NotificationService.Show = function (Id, Url, Label, Nonce) {
    NotificationFrame().src = Url
    NotificationLabel().innerText = Label
    Container().classList.add("notifshown")
    ShownNotification = {
        Id: Id,
        Url: Url,
        Label: Label,
        Nonce: Nonce
    }
}

NotificationService.Close = function () {
    Container().classList.remove("notifshown")
    NotificationFrame().src = ""
    ShownNotification = null
}

NotificationService.CloseId = function (Id, Nonce) {

}

//#region Bind events
window.addEventListener(
    "load",
    async function() {
        const CloseButton = document.getElementById("notificationclosebutton")
        if (!CloseButton) {return}
        CloseButton.addEventListener(
            "click",
            NotificationService.Close
        )
    }
)
//#endregion

export default NotificationService