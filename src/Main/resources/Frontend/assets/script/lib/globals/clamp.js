function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}
Math.clamp = clamp

export default clamp