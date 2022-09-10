CoreLauncher.IPC:RegisterMessage(
    "Other.ExtLink",
    function(Link)
        Import("ga.CoreLauncher.Libraries.OpenInBrowser")(Link)
    end
)
