local Http = {}

local Request = require("coro-http").request
local Json = require("json")

function Http.Request(Method, Url, Headers, Body, Options)
    if Headers == nil then
        Headers = {}
    end
    local UserAgentFound = false
    for Index, Header in pairs(Headers) do
        if Header[1] == "User-Agent" then
            UserAgentFound = true
            break
        end
    end
    if UserAgentFound == false then
        table.insert(
            Headers,
            {
                "User-Agent",
                string.format(
                    "CoreLauncher/CoreLauncher/%s (%s)",
                    TypeWriter.LoadedPackages["CoreLauncher"].Package.Version,
                    "corelauncher.ga"
                )
            }
        )
    end
    return Request(Method, Url, Headers, Body, Options)
end

function Http.JsonRequest(Method, Url, Headers, Body, Options)
    if type(Body) == "table" then
        Body = Json.encode(Body)
    end
    local Response, Body = Http.Request(Method, Url, Headers, Body, Options)
    return Response, ({Json.decode(Body)})[1]
end

return Http