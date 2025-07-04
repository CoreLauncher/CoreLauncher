import "@corelauncher/console-addon";
import hideConsole from "@corelauncher/console-hide";
import CoreLauncher from "./classes/CoreLauncher";
import InstallationManager from "./classes/InstallationManager";

process.title = "CoreLauncher";

const installation = new InstallationManager();
await installation.checkInstallation();
await installation.checkUpdates();

hideConsole();

new CoreLauncher();
