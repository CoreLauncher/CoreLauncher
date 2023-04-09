local FS = require("fs")

CoreLauncher.IPC:RegisterMessage(
    "Other.GetLatestRelease",
    CoreLauncher.API.Other.GetLatestRelease
)

CoreLauncher.IPC:RegisterMessage(
    "Other.NeedToShowRelease",
    function ()
        local Release = CoreLauncher.API.Other.GetLatestRelease()

        local LastShown = CoreLauncher.Config:GetKey("Updates.LastShown")
        local LastReleased = Release.Tag

        local NeedsToBeShown = LastShown ~= LastReleased
        if LastShown == nil then
            NeedsToBeShown = false
        end

        CoreLauncher.Config:SetKey("Updates.LastShown", LastReleased)
        return {
            NeedsToBeShown = NeedsToBeShown,
            Release = Release
        }
    end
)