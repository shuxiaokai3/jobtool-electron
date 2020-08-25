import { app, BrowserWindow, ipcMain } from "electron"; // eslint-disable-line
import config from "../config"
import update from "./update"
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
    global.__static = require("path")
        .join(__dirname, "/static")
        .replace(/\\/g, "\\\\"); // eslint-disable-line
}

let mainWindow;
const winURL =
    process.env.NODE_ENV === "development"
        ? `http://localhost:9080`
        : config.onlineUrl;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        },
    });
    mainWindow.loadURL(winURL);
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    //=====================================刷新页面，打开开发者工具====================================//
    ipcMain.on("vue-fresh-content", (event, status) => {
        mainWindow.webContents.reload();
    });
    ipcMain.on("open-dev-tools", (event, status) => {
        mainWindow.openDevTools();
    });
    //=====================================自动更新====================================//
    update();
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});


