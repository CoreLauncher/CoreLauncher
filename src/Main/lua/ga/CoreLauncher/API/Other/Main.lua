local Other = {}

local Spawn = require("coro-spawn")

function Other.OpenInBrowser(Link)
    local Command = {
        [true] = "start",
        [false] = "open"
    }
    local Result = Spawn(
        Command[TypeWriter.Os == "win32"],
        {
            args = {
                Link
            }
        }
    )
    Result.waitExit()
end