const PrettyBytes = require('bytes')

function GetProcess(From) {
    if (From.Parent) {
        return GetProcess(From.Parent)
    } else {
        return From
    }
}

class DataGetter {
    constructor() {

    }

    GetData(Key) {
        return GetProcess(this).GetData(Key)
    }

    SetData(Key, Value) {
        return GetProcess(this).SetData(Key, Value)
    }
}

class Task extends DataGetter {
    constructor(Index, Name, Handler, TaskManager, Parent, AppendElement) {
        super()
        this.Index = Index
        this.Name = Name
        this.Handler = Handler
        this.TaskManager = TaskManager
        this.Parent = Parent
        this.AppendElement = AppendElement

        this.DisplayMode = "Raw"

        this.TaskElement = this.TaskManager.CreateTaskElement(this.Index + 1)
        this.TaskElement.querySelector(".statetext").innerText = Name
        this.TaskElement.querySelector(".expandbutton").style.width = "0%"
        this.AppendElement.appendChild(this.TaskElement)
    }

    SetState(State) {
        this.TaskElement.querySelector(".statetext").innerText = State
    }

    SetDisplayMode(Mode) {
        this.DisplayMode = Mode
    }

    SetFinished() {
        this.Finished = true
        this.UpdateBar()
    }

    GetProgessPercent() {
        if (this.Finished) { return 100 }
        if (!this.MaximumProgress) { return 0 }
        if (!this.Progress) { return 0 }
        return this.Progress / this.MaximumProgress * 100
    }

    SetProgress(Progress) {
        this.Progress = Progress
        this.UpdateBar()
    }

    AddProgress(Progress) {
        if (!this.Progress) { this.Progress = 0 }
        this.Progress += Progress
        this.UpdateBar()
    }

    SetMaximumProgress(MaximumProgress) {
        this.MaximumProgress = MaximumProgress
        this.UpdateBar()
    }

    UpdateBar() {
        const Percent = Math.floor(this.GetProgessPercent())
        this.TaskElement.querySelector(".bar").style.width = `${Percent}%`
        const ProgressTextElement = this.TaskElement.querySelector(".progresstext")

        if (this.DisplayMode == "Raw") {
            ProgressTextElement.innerText = `${this.Progress || 0}/${this.MaximumProgress || 0}`
        } else if (this.DisplayMode == "Percent") {
            ProgressTextElement.innerText = `${Percent}%`
        } else if (this.DisplayMode == "Bytes") {
            ProgressTextElement.innerText = `${PrettyBytes(this.Progress || 0)}/${PrettyBytes(this.MaximumProgress || 0)}`
        }

        if (!this.Parent) { return }
        this.Parent.UpdateBar()
    }

    async Execute() {
        return await this.Handler(this, GetProcess(this))
    }
}

class TaskList extends DataGetter {
    constructor(Index, Name, Handler, TaskManager, Parent, AppendElement) {
        super()
        this.Index = Index
        this.Name = Name
        this.Handler = Handler
        this.TaskManager = TaskManager
        this.Parent = Parent
        this.AppendElement = AppendElement

        this.Tasks = []
        this.ExecuteMode = "Parallel"

        this.TaskElement = this.TaskManager.CreateTaskElement(this.Index)
        this.TaskElement.querySelector(".statetext").innerText = Name
        this.AppendElement.appendChild(this.TaskElement)
    }

    AddTask(Name, Handler) {
        const CreatedTask = new Task(this.Index + 1, Name, Handler, this.TaskManager, this, this.TaskElement.querySelector(".expandrow"))
        this.Tasks.push(CreatedTask)
        return CreatedTask
    }

    AddTaskList(Name, Handler) {
        const CreatedTaskList = new TaskList(this.Index + 1, Name, Handler, this.TaskManager, this, this.TaskElement.querySelector(".expandrow"))
        this.Tasks.push(CreatedTaskList)
        return CreatedTaskList
    }

    

    GetProgessPercent() {
        if (!this.Tasks.length) { return 0 }
        const TotalProgress = this.Tasks.reduce((TotalProgress, Task) => TotalProgress + Task.GetProgessPercent(), 0)
        return TotalProgress / this.Tasks.length
    }

    UpdateBar() {
        const Percent = this.GetProgessPercent()
        this.TaskElement.querySelector(".bar").style.width = `${Percent}%`
        this.TaskElement.querySelector(".progresstext").innerText = `${Math.floor(Percent)}%`
        if (!this.Parent) { return }
        this.Parent.UpdateBar()
    }

    SetExecuteMode(Mode) {
        this.ExecuteMode = Mode
    }

    async Execute() {
        if (this.Handler) {
            await this.Handler(this, GetProcess(this))
        }

        if (this.ExecuteMode == "Serial") {
            for (const Task of this.Tasks) {
                await Task.Execute()
            }
        } else {
            return await Promise.all(this.Tasks.map(Task => Task.Execute()))
        }
    }
}

class TaskProcess extends TaskList {
    constructor(Name, TaskManager) {
        const ProcessElement = TaskManager.CreateProcessElement(Name)

        super(0, "", null, TaskManager, null, ProcessElement.querySelector(".taskholder"))
        this.SetExecuteMode("Serial")

        this.Name = Name
        this.TaskManager = TaskManager

        this.ProcessElement = ProcessElement

        this.Data = {}
    }

    Register() {
        this.TaskManager.ScreenElement.appendChild(this.ProcessElement)
        this.TaskManager.Processes.push(this)
        this.Execute()
    }

    UnRegister() {
        this.TaskManager.Processes.splice(this.TaskManager.Processes.indexOf(this), 1)
    }

    GetData(Key) {
        return this.Data[Key]
    }

    SetData(Key, Value) {
        this.Data[Key] = Value
    }
}

class TaskManager { 
    constructor() {
        this.Processes = []
    }

    RegisterScreenElement(Element) {
        this.ScreenElement = Element

        this.TaskTemplate = this.ScreenElement.querySelector(".task")
        this.TaskTemplate.remove()

        this.ProcessTemplate = this.ScreenElement.querySelector(".process")
        this.ProcessTemplate.remove()

    }

    CreateProcessElement(Name) {
        const ProcessElement = this.ProcessTemplate.cloneNode(true)
        ProcessElement.querySelector(".title").innerText = Name
        return ProcessElement
    }

    CreateTaskElement(Index) {
        const TaskElement = this.TaskTemplate.cloneNode(true)
        TaskElement.querySelector(".barrow").style.setProperty("--index", Index)
        return TaskElement
    }

    CreateProcess(Name) {
        return new TaskProcess(Name, this)
    }
}

return TaskManager