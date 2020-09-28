/**
 * @description        项目全局配置信息
 * @author              shuxiaokai
 * @create             2020-08-24 14:19
 */

import packageJSON from "@/../../package.json"

export default {
    isDev: process.env.NODE_ENV === "development",
    updateConfig: {
        version: packageJSON.version,
        server: "http://job.xrdev.cn",
        filePath: "/electron/windows"
    },
    onlineUrl: "https://jobtool.cn",
    pagesConfig: {
        layout: {
            title: packageJSON.name
        },
    },
};
