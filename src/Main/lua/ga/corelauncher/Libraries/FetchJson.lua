local NodeFetch = TypeWriter:JsRequire("node-fetch")

local function FetchJson(Url)
    local _, Response = Await(NodeFetch(NodeFetch, Url))
    local _, Json = Await(Response:json())
    return Json
end

return FetchJson