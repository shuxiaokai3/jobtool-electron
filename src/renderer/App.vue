<template>
    <div id="app">
        <!-- <router-view></router-view> -->
        <el-button @click="send">发送</el-button>
        <el-button @click="stop">停止</el-button>
    </div>
</template>
 
<script>
import { ipcRenderer  } from "electron";
import HttpClient from "@/api/net.js"
const httpClient = new HttpClient();
export default {
    mounted() {
        window.addEventListener("keyup", (e) => {
            e.stopPropagation();
            if (e.ctrlKey && e.key === "F5") {
                e.preventDefault();
                ipcRenderer.send("vue-fresh-content")
            }
        })
    },
    methods: {
        send() {
            httpClient.request("http://127.0.0.1:7004/api/security/user_list", {
                method: "get",
                
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.error(err);
            });
            // console.log(curl)
        },
        stop() {
            httpClient.stop();
        },
    },
};
</script>

 

<style lang="scss">
#app {
    height: 100%;
}
</style>
