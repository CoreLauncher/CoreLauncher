return async function WaitForEvent(EventTarget, EventName) {
    return await new Promise(
        (Resolve) => {
            if (EventTarget.addEventListener) {
                function Listener(Event) {
                    EventTarget.removeEventListener(EventName, Listener)
                    Resolve(Event)
                }
                EventTarget.addEventListener(EventName, Listener)
            } else {
                function Listener(Event) {
                    EventTarget.off(EventName, Listener)
                    Resolve(Event)
                }
                EventTarget.on(EventName, Listener)
            }
        }
    )
}