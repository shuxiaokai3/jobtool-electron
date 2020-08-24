/**
 * @description        项目全局配置信息
 * @author              shuxiaokai
 * @create             2020-08-24 14:19
 */

export default {
    isDev: process.env.NODE_ENV === "development",
    updateConfig: {
        version: "0.8.0",
        server: "http://job.xrdev.cn",
        filePath: "/electron/windows"
    },
};
