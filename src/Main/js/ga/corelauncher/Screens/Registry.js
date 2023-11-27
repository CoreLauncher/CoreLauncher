return async function(ScreenManager) {
    ScreenManager.RegisterScreen("LoadingScreen", await Import("ga.corelauncher.Screens.LoadingScreen"))
    ScreenManager.RegisterScreen("Main", await Import("ga.corelauncher.Screens.Main"))
}