function GetProperty(Data, Parent) {
    if (Data.Type == "Row") {
        return CollectProperties(Data.Properties, Parent.querySelector(`#renderedproperty_${Data.Id}`))
    }

    const Element = Parent.querySelector(`#renderedproperty_${Data.Id}`)
    if (!Element) { return }

    var Value = Element.value
    if (Value == "") { Value = Data.Default }
    if (Data.Type == "Number") { Value = Number(Value) }

    return Value
}

function CollectProperties(Data, Parent) {
    const Properties = {}

    for (const Property of Data) {
        Properties[Property.Id] = GetProperty(Property, Parent)
    }

    return Properties
}

export default CollectProperties