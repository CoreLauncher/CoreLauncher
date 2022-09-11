local Http = {}

local Request = require("coro-http").request
local Json = require("json")

function Http.Request(Method, Url, Headers, Body, Options)
    return Request(Method, Url, Headers, Body, Options)
end

function Http.JsonRequest(Method, Url, Headers, Body, Options)
    local Response, Body = Request(Method, Url, Headers, Body, Options)
    return Response, ({Json.decode(Body)})[1]
end

return Http