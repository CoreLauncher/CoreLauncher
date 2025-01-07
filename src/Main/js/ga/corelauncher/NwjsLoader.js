const NWJSHelper = await Import("me.corebyte.NW")
const StaticServer = await Import("me.corebyte.static")

globalThis.CORELAUNCHER_DEV = process.env.CORELAUNCHER_DEV == "true"

if (!globalThis.nw) {
    StaticServer(
        9875,
        "CoreLauncher",
        "Frontend"
    )
}

await NWJSHelper(
    {
        Id: "CoreLauncher",
        Name: "CoreLauncher",
        Main: CORELAUNCHER_DEV ? "http://localhost:9874" : "http://localhost:9875",
        Frame: false,
        Icon: {
            Win: "CoreLauncher:/ico.ico",
            Mac: "CoreLauncher:/ico.icns",
        }
    }
)

await Import("ga.corelauncher")