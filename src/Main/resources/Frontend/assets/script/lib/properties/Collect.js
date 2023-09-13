function GetProperty(Data, Parent) {
    const Element = Parent.querySelector(`#renderedproperty_${Data.Id}`)
    if (!Element) { return }

    var Value = Element.value
    if (Value == "" || Value == undefined) {
        Value = null
        if (Data.SaveDefault == true) { Value = Data.Default }
        return Value
    }
    if (Data.Type == "Number") { Value = Number(Value) }
    if (Data.Type == "Boolean") { Value = Value == "true" }

    return Value
}

function CollectProperties(Data, Parent) {
    const Properties = {}

    for (const PropertyRow of Data) {
        for (const Property of PropertyRow) {
            Properties[Property.Id] = GetProperty(Property, Parent)
        }
    }

    return Properties
}

export default CollectProperties