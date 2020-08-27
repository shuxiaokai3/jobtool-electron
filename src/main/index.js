import { app, BrowserWindow, ipcMain } from "electron"; // eslint-disable-line
import config from "../config"
import ip from "ip"
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
//`http://localhost:9080`
const winURL = process.env.NODE_ENV === "development" ? `http://localhost:9080` : config.onlineUrl;
// const winURL = process.env.NODE_ENV === "development" ? `https://jobtool.cn` : config.onlineUrl;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 768,
        width: 1024,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webviewTag: true
        },
    });
    mainWindow.loadURL(winURL);
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
    //=====================================刷新页面，打开开发者工具====================================//
    ipcMain.on("vue-fresh-content", (event, status) => {
        mainWindow.webContents.session.clearCache().then(() => {
            mainWindow.webContents.reload()
        });
    });
    ipcMain.on("vue-strong-reload", (event, status) => {
        mainWindow.webContents.session.clearCache().then(() => {
            mainWindow.webContents.reload()
        });
    });
    ipcMain.on("open-dev-tools", (event, status) => {
        mainWindow.webContents.openDevTools();
    });
    // ipcMain.on("vue-get-ip", (event, status) => {
    //     mainWindow.webContents.send("getIpAdress", ip.address());
    // });
    //=====================================主进程  =>  渲染进程====================================//
   
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

//=====================================其他处理====================================//
