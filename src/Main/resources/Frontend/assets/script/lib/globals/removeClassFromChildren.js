function RemoveClassFromChildren(Element, ClassName) {
    for (const Child of Element.children) {
        Child.classList.remove(ClassName)
    }
}

globalThis.RemoveClassFromChildren = RemoveClassFromChildren
export default RemoveClassFromChildren