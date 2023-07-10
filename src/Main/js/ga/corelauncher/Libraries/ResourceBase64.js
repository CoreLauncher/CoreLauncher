const FS = require("fs")
const Base64Img = require("base64-img")

module.exports = function(ResourcePath) {
    const IconPath = TypeWriter.ResourceManager.GetFilePath(ResourcePath)
    return Base64Img.base64Sync(IconPath)
}