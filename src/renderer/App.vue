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
        })
    }
};
</script>

 

<style lang="scss">
#app {
    height: 100%;
}
</style>
