<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
 
<script>
import { ipcRenderer  } from "electron";

export default {
    mounted() {
        window.addEventListener("keyup", (e) => {
            e.stopPropagation();
            if (e.ctrlKey && e.key === "F5") {
                e.preventDefault();
                ipcRenderer.send("vue-fresh-content")
            }
            if (e.ctrlKey && e.key === "F12") {
                e.preventDefault();
                ipcRenderer.send("open-dev-tools")
            }
        })
        this.init();
    },
    methods: {
        handleTest() {
            ipcRenderer.send("upload");
        },
        init() {
            ipcRenderer.on("vue-update-downloaded", (e, upload) => {
                console.log("下载完成", e, upload);
            });
            ipcRenderer.on("vue-download-progress", (e, progressObj) => {
                console.log("下载种", e, progressObj);
            });
            ipcRenderer.on("vue-download-error", (e, error) => {
                console.error(error);
            });
        }
    },
};
</script>

 

<style lang="scss">
#app {
    height: 100%;
}
</style>
