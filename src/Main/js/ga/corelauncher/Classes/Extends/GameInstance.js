class GameInstance {
    constructor(InstanceData, Game) {
        this.InstanceData = InstanceData
        this.Game = Game
    }

    SuperConstructor() {

    }

    GetName() {
        return this.InstanceData.Name
    }

    Save() {
        CoreLauncher.DataBase.SetKey(`Game.${this.Game.Id}.Instances.${this.InstanceData.UUID}`, this.InstanceData)
    }
}

return GameInstance