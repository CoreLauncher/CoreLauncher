function GetHashQuery() {
    const Data = {}
    location.hash.split("#")[1].split("&").forEach(
        function(Line) {
            var LineData = Line.split("=")
            var Key = LineData[0]
            LineData.shift()
            var Value = Number(LineData[0]) || LineData.join("=")
            Data[Key] = Value
        }
    )
    return Data
}

console.log(GetHashQuery())

window.addEventListener(
    "load",
    async function() {
        const HashQuery = GetHashQuery()
        console.log(HashQuery)
        if (HashQuery.close == "true") {
            document.getElementById("text").innerText = "You can now close this window!"
        } else {
            await CoreLauncher.IPC.Send(
                "Main",
                "AccountCallback",
                {
                    Type: "Discord",
                    Data: HashQuery
                }
            )
            this.location.hash = "close=true"
            this.location.reload()
        }
        
    }
)
