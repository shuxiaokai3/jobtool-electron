<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
 
<script>
let ipcRenderer = null;
if (window.require) {
    ipcRenderer = window.require("electron").ipcRenderer;
}

export default {
    mounted() {
        this.initShortcut();
        // this.resumePage(); //回复页面
    },
    methods: {
        //初始化快捷键
        initShortcut() {
            if (window.require) {
                window.addEventListener("keyup", (e) => {
                    // console.log(e, e.ctrlKey)
                    // e.stopPropagation();
                    if (e.ctrlKey && e.key === "F5") {
                        e.preventDefault();
                        ipcRenderer.send("vue-strong-reload")
                    }
                    if (e.ctrlKey && e.key === "F12") {
                        e.preventDefault();
                        ipcRenderer.send("open-dev-tools")
                    }
                    if (e.ctrlKey && e.key === "ArrowLeft") {
                        e.preventDefault();
                        this.$router.go(-1);
                    }
                    if (e.ctrlKey && e.key === "ArrowRight") {
                        e.preventDefault();
                        this.$router.go(1);
                    }
                })
            }
        },
    },
};
</script>

 

<style lang="scss">
#app {
    height: 100%;
}
</style>
