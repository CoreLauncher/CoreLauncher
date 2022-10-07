local Spawn = require("coro-spawn")
local Base = require("base64")
return function (Link)
    if TypeWriter.Os == "win32" then
        os.execute("start http://localhost:9874/redirect/#" .. Base.encode(Link))
    else
        os.execute("open http://localhost:9874/redirect/#" .. Base.encode(Link))
    end
end