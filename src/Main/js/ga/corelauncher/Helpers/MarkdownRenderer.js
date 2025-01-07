const MarkdownIt = require("markdown-it")
const MarkdownItInstance = new MarkdownIt({})

return function MarkdownRenderer(MarkdownText) {
    return (MarkdownItInstance.renderInline(MarkdownText)).replaceAll("<a href=", `<a onclick="nw.Shell.openExternal(this.getAttribute('openlink'))" class="linkappearance" openlink=`)
}