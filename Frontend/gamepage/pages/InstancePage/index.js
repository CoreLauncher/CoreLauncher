window.addEventListener(
    "load",
    async function() {
        const Game = await CoreLauncher.IPC.Send("Main", "Games.GetGame", QueryParameters.game)
        console.log(Game)
        const InstanceProperties = await CoreLauncher.IPC.Send("Main", "Games.Instances.GetInstanceProperties", Game.Id)
        console.log(InstanceProperties)
        const DataForm = document.getElementById("dataform")

        const Indexes = {}
        for (const PropertyKey in InstanceProperties) {
            const Property = InstanceProperties[PropertyKey]
            Property.Key = PropertyKey
            Indexes[Property.Index] = Property
        }

        for (const PropertyIndex of Object.keys(Indexes).sort()) {
            const Property = Indexes[PropertyIndex]
            const PropertyKey = Property.Key
            const PropertyElementId = `InstanceDataForm_${PropertyKey}`

            const Label = document.createElement("label")
            Label.setAttribute("for", PropertyElementId)
            Label.innerText = Property.Label
            DataForm.appendChild(Label)

            if (false) {
            } else if (Property.Type == "number") {
                const Number = document.createElement("input")
                Number.setAttribute("type", "number")
                Number.setAttribute("id", PropertyElementId)
                Number.setAttribute("name", PropertyKey)
                Number.setAttribute("min", Property.Clamp.Min)
                Number.setAttribute("max", Property.Clamp.Max)
                Number.setAttribute("value", Property.Default)
                Number.setAttribute("placeholder", Property.Default)
                Number.addEventListener(
                    "change",
                    async function() {
                        if (Number.value == "") {
                            Number.value = Property.Default
                        }
                    }
                )
                DataForm.appendChild(Number)
            } else if (Property.Type == "string") {
                const String = document.createElement("input")
                String.setAttribute("type", "string")
                String.setAttribute("id", PropertyElementId)
                String.setAttribute("name", PropertyKey)
                String.setAttribute("value", Property.Default)
                String.setAttribute("placeholder", Property.Default)
                String.addEventListener(
                    "change",
                    async function() {
                        if (String.value == "") {
                            String.value = Property.Default
                        }
                    }
                )
                DataForm.appendChild(String)
            } else if (Property.Type == "boolean") {
                
            } else if (Property.Type == "table") {
                const Select = document.createElement("select")
                Select.setAttribute("id", PropertyElementId)
                Select.setAttribute("name", PropertyKey)
                console.log(Property)
                for (const SelectOption of Property.Values) {
                    const Option = document.createElement("option")
                    Option.setAttribute("value", SelectOption)
                    Option.innerText = SelectOption
                    Select.appendChild(Option)
                }
                DataForm.appendChild(Select)
            }
            const Br = document.createElement("br")
            DataForm.appendChild(Br)
        }
    }
)