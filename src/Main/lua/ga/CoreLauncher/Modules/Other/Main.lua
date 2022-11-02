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

        p(LastShown)
        p(LastReleased)

        local NeedsToBeShown = LastShown ~= LastReleased
    end
)