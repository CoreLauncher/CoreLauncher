const Screen = {}

Screen.Init = async function (ScreenElement, Screen) {
    const AccountTypes = await CoreLauncher.AccountManager.ListAccountTypes()
    console.log(AccountTypes)
    const AccountTypeListBlock = ScreenElement.querySelector(".newaccountlist")
    const AccountTypeList = AccountTypeListBlock.querySelector(".accounttypes")

    if (Object.keys(AccountTypes).length == 0) {
        const WarningBlock = ScreenElement.querySelector(".noaccountsblock")
        WarningBlock.style.display = null
        WarningBlock.style.visibility = null

        AccountTypeListBlock.style.display = "none"
        AccountTypeListBlock.style.visibility = "hidden"
        return
    }

    const AccountTypeElementTemplate = AccountTypeListBlock.querySelector(".accounttype")
    AccountTypeElementTemplate.remove()
    for (const AccountTypeId in AccountTypes) {
        const AccountType = AccountTypes[AccountTypeId]
        const AccountTypeElement = AccountTypeElementTemplate.cloneNode(true)
        AccountTypeElement.querySelector("img").src = await CoreLauncher.AccountManager.GetAccountTypeIconBase64(AccountTypeId)
        AccountTypeElement.querySelector("a").innerText = AccountType.Name
        AccountTypeList.appendChild(AccountTypeElement)
    }

}

Screen.Show = async function (ScreenElement, Screen) {
    ScreenElement.querySelectorAll(".accounttype.fullwidth").forEach(
        function (Element) {
            Element.style.setProperty("--hover-width", Element.clientWidth + 1 + "px")
            Element.classList.remove("fullwidth")
        }
    )
}

export default Screen