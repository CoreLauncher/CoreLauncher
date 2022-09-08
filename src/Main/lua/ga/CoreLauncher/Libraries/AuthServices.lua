local AuthServices = Class:extend()
local Json = require("json")
local Request = require("coro-http").request

function AuthServices:initialize()
    self.Url = ({[true] = "localhost:8423", [false] = "auth.corelauncher.ga"})[CoreLauncher.Dev]
end

local Resolvers = {
    Discord = function (Code)
        
    end,
    MSA = function (Code)
        
    end
}

function AuthServices:Resolve(Name, Code)
    
end

return AuthServices