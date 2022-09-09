local AuthServices = Class:extend()
local Json = require("json")
local Request = require("coro-http").request

function AuthServices:initialize()
    self.Url = ({[true] = "http://localhost:8423", [false] = "https://auth.corelauncher.ga"})[CoreLauncher.Dev]
end

function AuthServices:RedeemAuthCode(Name, Code)
    p(self.Url .. string.format("/%s/token/?code=%s", Name, Code))
    local Response, Body = Request(
        "GET",
        self.Url .. string.format("/%s/token/?code=%s", string.lower(Name), Code)
    )
    p(Body)
    p(Json.decode(Body))
    return Json.decode(Body)
end

local Resolvers = {
    Discord = {
        Token = function (self, Code)
        
        end,
        Refresh = function (self)
            
        end
    },
    MSA = {
        Token = function (self, Code)
            p(" a")
            p(Code)
            local TokenData = self:RedeemAuthCode("MSA", Code)
            local Data = {
                TokenData = TokenData
            }
            p(Data)
        end,
        Refresh = function (self)
            
        end
    }
}

function AuthServices:Resolve(Name, Code)
    return Resolvers[Name].Token(self, Code)
end

function AuthServices:Refresh(Name)
    return Resolvers[Name].Refresh(self)
end

function AuthServices:Get(Name)
    
end

return AuthServices