const NotificationService = {}

function Container() {
    return document.getElementById("container")
}
function NotificationLabel() {
    return document.getElementById("notificationlabel")
}
function NotificationFrame() {
    return document.getElementById("notiframe")
}
function CloseButton() {
    return document.getElementById("notificationclosebutton")
}

var ShownNotification
NotificationService.Show = function (Id, Url, Label, Nonce, Closable = true) {
    NotificationFrame().src = Url
    NotificationLabel().innerText = Label
    Container().classList.add("notifshown")
    if (Closable) {
        CloseButton().style.display = ""
    } else {
        CloseButton().style.display = "none"
    }
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