return function (From, To)
    local Result = require("coro-spawn")(
        "tar",
        {
            args = {
                "-xf",
                From,
                "-C", To
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