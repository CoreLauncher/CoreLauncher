window.addEventListener(
    "load",
    async function() {
        const GameId = QueryParameters["game"];
        const AccountId = QueryParameters["type"]
        const Game = await CoreLauncher.IPC.Send(
            "Main",
            "Games.GetGame",
            GameId
        )
        const Account = await CoreLauncher.IPC.Send(
            "Main",
            "Accounts.GetAccountType",
            AccountId
        )
        const NoticeText = document.getElementById("noticetext")
        const ConnectButton = document.getElementById("connectbutton")
        const ReplaceData = {
            GameName: Game.Name,
            AccountName: Account.Name
        }
        NoticeText.innerText = NoticeText.innerText.interpolate(ReplaceData)
        ConnectButton.innerText = ConnectButton.innerText.interpolate(ReplaceData)
        
        ConnectButton.addEventListener(
            "click",
            async function() {
                console.log("Button clicked")
                await CoreLauncher.IPC.Send(
                    "Main",
                    "Accounts.StartFlow",
                    AccountId
                )
                console.log("Button completed")
            }
        )
    }
)