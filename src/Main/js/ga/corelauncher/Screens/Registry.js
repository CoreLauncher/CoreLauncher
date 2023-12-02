return async function(ScreenManager) {
    await ScreenManager.RegisterScreen("LoadingScreen", await Import("ga.corelauncher.Screens.LoadingScreen"))
    await ScreenManager.RegisterScreen("Main", await Import("ga.corelauncher.Screens.Main"))
    await ScreenManager.RegisterScreen("Main.GamesList", await Import("ga.corelauncher.Screens.Main.GamesList"))
    await ScreenManager.RegisterScreen("Main.GamesList.Generic", await Import("ga.corelauncher.Screens.Main.GamesList.Generic"))
    await ScreenManager.RegisterScreen("Main.Settings", await Import("ga.corelauncher.Screens.Main.Settings"))
    await ScreenManager.RegisterScreen("Main.Settings.About", await Import("ga.corelauncher.Screens.Main.Settings.About"))
    await ScreenManager.RegisterScreen("Main.Settings.Accounts", await Import("ga.corelauncher.Screens.Main.Settings.Accounts"))
    await ScreenManager.RegisterScreen("Main.Settings.GameInformation", await Import("ga.corelauncher.Screens.Main.Settings.GameInformation"))
    await ScreenManager.RegisterScreen("Main.Settings.Instances", await Import("ga.corelauncher.Screens.Main.Settings.Instances"))
}