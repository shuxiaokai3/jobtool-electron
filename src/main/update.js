
/** 
 * @description        自动更新
 * @author              shuxiaokai
 * @create             2020-08-24 14:23
 * @param {any}        variable - 任意类型变量       
 * @param {String=}    [name=xxx] - 任意类型变量       
 * @param {Number}     age - 数字类型       
 * @return {String}    返回字符串
 */
import path from "path"
import config from "../config"
import { autoUpdater } from "electron-updater"
import { BrowserWindow, ipcMain } from "electron"; // eslint-disable-line


function update() {
    const server = config.updateConfig.server;
    const url = `${server}${config.updateConfig.filePath}`;
    const winId = BrowserWindow.getFocusedWindow().id;
    const win = BrowserWindow.fromId(winId)
    if (process.env.NODE_ENV === "development") {
        autoUpdater.updateConfigPath = path.join(__dirname, "../../dev-app-update.yml");
    }
    ipcMain.on("upload", () => { 
        autoUpdater.checkForUpdates()
    })
    autoUpdater.currentVersion = config.updateConfig.version;
    autoUpdater.setFeedURL(url);
    //=====================================反馈更新事件给render进程====================================//
    //下载完成
    autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
        win.webContents.send("vue-update-downloaded", {
            event,
            releaseNotes,
            releaseName
        });
    });
    //下载过程
    autoUpdater.on("download-progress", (progressObj) => {
        win.webContents.send("vue-download-progress", progressObj);
    });
    //更新错误
    autoUpdater.on("error", error => {
        console.error(error)
        win.webContents.send("vue-download-error", error);
    })
}
export default update;
