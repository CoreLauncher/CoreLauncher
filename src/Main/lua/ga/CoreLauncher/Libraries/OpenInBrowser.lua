local Spawn = require("coro-spawn")
local Base = require("base64")
return function (Link)
    if TypeWriter.Os == "win32" then
        os.execute("start http://localhost/redirect#" .. Base.encode(Link))
    else
        os.execute("open http://localhost/redirect#" .. Base.encode(Link))
    end
end