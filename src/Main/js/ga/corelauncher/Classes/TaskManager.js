class TaskProcess extends TaskList {
    constructor(Name, Icon, TaskManager) {
        super()
        this.Name = Name
        this.Icon = Icon
        this.TaskManager = TaskManager
    }


}

class TaskList {
    constructor() {
        this.Tasks = []
    }

    AddTask(Name, Handler) {
        const Task = new Task(Name, Handler, this)
        this.Tasks.push(Task)
        return Task
    }
}

class Task {
    constructor(Name, Icon, TaskManager, Parent) {
        this.Name = Name
        this.Icon = Icon
    }
}

class TaskManager { 
    constructor() {

    }

    CreateProcess(Name, Icon) {
        return new TaskProcess(Name, Icon, this)
    }
}