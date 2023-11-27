return async function(ScreenManager) {
    ScreenManager.RegisterScreen("Main", await Import("ga.corelauncher.Screens.Main"))
}