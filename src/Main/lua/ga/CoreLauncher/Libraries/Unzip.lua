local Spawn = require("coro-spawn")
local Path = require("path")
local FS = require("fs")

return function (From, To)
    FS.mkdirSync(To)
    local Result, Error = Spawn(
        "tar",
        {
            args = {
                "-xf", Path.resolve(From),
                "-C", Path.resolve(To)
            },
            stdio = {
                process.stdin.handle,
                process.stdout.handle,
                process.stderr.handle
            }
        }
    )
    Result.waitExit()
end