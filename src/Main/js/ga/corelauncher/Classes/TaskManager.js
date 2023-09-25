const UUID = require("uuid").v4

class TaskManager {
    constructor() {
        this.Tasks = []
    }

    ListTasks() {
        return this.Tasks
    }

    GetTask(Id) {
        return this.Tasks.find(Task => Task.Id == Id)
    }

    AddTask(Name, Runner, Parent) {
        const Task = {
            Name: Name,
            Runner: Runner,
            Parent: Parent,
            Id: UUID() 
        }

        this.Tasks.push(Task)
        return Task
    }
}

module.exports = TaskManager