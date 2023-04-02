local Other = {}

local Spawn = require("coro-spawn")

function Other.OpenInBrowser(Link)
    local Command
    local Arguments = {}
    if TypeWriter.Os == "win32" then
        Command = "powershell.exe"
        
        table.insert(Arguments, "-NoProfile")
		table.insert(Arguments, "-NonInteractive")
		table.insert(Arguments, "-ExecutionPolicy")
		table.insert(Arguments, "Bypass")
		table.insert(Arguments, "-Command")
		table.insert(
            Arguments,
            string.format(
                "Start '%s'", Link
            )
        )
    else
        Command = "open"
        table.insert(Arguments, Link)
    end

    local Result, Error = Spawn(
        Command,
        {
            args = Arguments,
            stdio = {
                process.stdin.handle,
                process.stdout.handle,
                process.stderr.handle
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
        ReleaseCache = ReturnData
    end
    
    return {
        Name = Data.name,
        Tag = Data.tag_name,
        Body = Data.body,
        PublishedDate = Data.published_at
    }
end

return Other