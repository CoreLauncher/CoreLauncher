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

local ReleaseCache
function Other.GetLatestRelease(UseCache)
    if UseCache == nil then
        UseCache = true
    end
    local Data
    if UseCache then
        Data = ReleaseCache
    end
    if Data == nil then
        local Response, ReturnData = CoreLauncher.Http.JsonRequest(
            "GET",
            "https://api.github.com/repos/CoreLauncher/CoreLauncher/releases/latest"
        )
        Data = ReturnData
    end
    
    return {
        Name = Data.name,
        Tag = Data.tag_name,
        Body = Data.body,
        PublishedDate = Data.published_at
    }
end

return Other