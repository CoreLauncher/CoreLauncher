const UUID = require("uuid").v4

class TaskManager {
    constructor() {
        this.Processes = {}
    }

    ListProcesses() {
        return this.Processes
    }

    GetProcess(Id) {
        return this.Tasks.find(Task => Task.Id == Id)
    }

    GetTask(Id) {
        const SplitId = Id.split(".")
        const ProcessId = SplitId[0]
        const TaskId = SplitId[1]
        return this.Processes[ProcessId].Tasks[TaskId]
    }

    CreateProcess(Name) {
        const ProcessId = UUID()
        this.Processes[ProcessId] = {
            Id: ProcessId,
            Name: Name,
            Tasks: {}
        }

        return ProcessId
    }

    AddTask(Name, Step, ProcessId, Total) {
        const TaskId = UUID()

        this.Processes[ProcessId].Tasks[TaskId] = {
            Id: TaskId,
            Name: Name,
            Step: Step,
            State: "Pending",
            Completed: -1,
            Total: Total || 0
        }

        return `${ProcessId}.${TaskId}`
    }

    SetTaskState(Completed, Total, State, TaskId) {
        const Task = this.GetTask(TaskId)
        Task.Completed = Completed
        Task.Total = Total
        Task.State = State
    }
}

module.exports = TaskManager