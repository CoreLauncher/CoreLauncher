return async function(ScreenManager) {
    await ScreenManager.RegisterScreen("LoadingScreen", await Import("ga.corelauncher.Screens.LoadingScreen"))
    await ScreenManager.RegisterScreen("Main", await Import("ga.corelauncher.Screens.Main"))
    await ScreenManager.RegisterScreen("Main.GamesList", await Import("ga.corelauncher.Screens.Main.GamesList"))
}