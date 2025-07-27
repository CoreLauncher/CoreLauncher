import "@corelauncher/console-addon";
import hideConsole from "@corelauncher/console-hide";
import CoreLauncher from "./classes/CoreLauncher";
import InstallationManager from "./classes/InstallationManager";
import SingleInstanceLock from "./classes/SingleInstanceLock";

process.title = "CoreLauncher";

const installation = new InstallationManager();
await installation.checkInstallation();

// Check if another instance is running and forward arguments to it
await SingleInstanceLock.check();
await installation.checkUpdates();

hideConsole();

new CoreLauncher();
