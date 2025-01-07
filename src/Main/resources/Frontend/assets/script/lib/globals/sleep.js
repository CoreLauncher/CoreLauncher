const sleep = ms => new Promise(r => setTimeout(r, ms))
globalThis.sleep = sleep

export default sleep