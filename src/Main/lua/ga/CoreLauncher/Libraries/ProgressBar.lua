local ProgressBar = Class:extend()

function ProgressBar:initialize()
    self.Stage = "Unknown"
    self.Count = 0
    self.Total = 0
    self.Percent = 0
    self.Shown = false
end

function ProgressBar:SetStage(Name)
    self.Stage = Name
end

function ProgressBar:SetProgress(Count, Total)
    self.Count = Count
    self.Total = Total
    self.Percent = Count / Total * 100
    if self.Percent == 100 then
        self.Shown = false
    else
        self.Shown = true
    end
end

function ProgressBar:Reset()
    self.Count = 0
    self.Total = 0
    self.Percent = 0
end

local Listeners = {"inframe-2"}
function ProgressBar:Update()
    if CoreLauncher.Window then
        if self.Percent == 100 then
            CoreLauncher.Window:setProgressBar(0)
        else
            CoreLauncher.Window:setProgressBar(self.Percent / 100)
        end
    end
    for _, Listener in pairs(Listeners) do
        CoreLauncher.IPC:Send(
            Listener,
            "ProgressBar.Update",
            {
                Stage = self.Stage,
                Count = self.Count,
                Total = self.Total,
                Percent = self.Percent,
                Shown = self.Shown
            }
        )
    end
end

return ProgressBar