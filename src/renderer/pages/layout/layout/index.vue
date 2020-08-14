/*
    创建者：shuxiaokai
    创建时间：2019-09-06 11:31
    模块名称：xxxx
    备注：xxxx
*/
<template>
    <div class="s-content">
        <div class="s-header hidden-md-and-down">
            <div class="header-left fl">
                <el-menu :default-active="activeMenu" mode="horizontal" background-color="#343a40" text-color="#fff" active-text-color="#ffd04b" :router="true">
                    <el-menu-item>
                        <span class="f-lg" @click="jumpToHome">内部管理工具</span>
                    </el-menu-item>
                    <el-menu-item v-for="(item, index) in menus" :key="index" :index="item.path">{{ item.name }}</el-menu-item>
                    <!-- <el-menu-item index="/v1/b/b">项目地址</el-menu-item>
                    <el-menu-item index="/v1/c/c">文件管理</el-menu-item>
                    <el-menu-item index="/v1/e/e">在线面试</el-menu-item>
                    <el-menu-item index="/v1/g/g">权限管理</el-menu-item> -->
                    <!-- <el-menu-item index="/v1/h/h">代码走查</el-menu-item> -->
                </el-menu>
            </div>
            <div class="header-right mr-5 fr">
                <div class="operation">
                    <div title="刷新" class="op_item" @click="freshContent">
                        <span class="el-icon-refresh-right"></span>
                    </div>
                    <div title="后退" class="op_item" @click="goBack">
                        <span class="el-icon-back"></span>
                    </div>
                    <div class="op_item" @click="goForward">
                        <span title="前进" class="el-icon-right"></span>    
                    </div>                    
                </div>
                <el-dropdown>
                    <span class="cursor-pointer">
                        <span>{{ userInfo.realName }}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item>新消息推送</el-dropdown-item>
                        <el-dropdown-item @click.native="logout">退出登陆</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import { ipcRenderer  } from "electron";
export default {
    data() {
        return {
            activeMenu: "/v1/a/a",
        };
    },
    computed: {
        menus() {
            return this.$store.state.permission.menus;
        },
        userInfo() {
            return this.$store.state.permission.userInfo
        },
    },
    created() {
        this.initCurrentMenu();
    },
    methods: {
        initCurrentMenu() {
            this.activeMenu = this.$route.path;
        },
        //跳转到首页
        jumpToHome() {
            this.$router.push("/v1/apidoc/doc-list");
        },
        //退出登录
        logout() {
            sessionStorage.clear();
            this.$router.push("/login");
        },
        //=====================================页面操作====================================//
        //刷新页面
        freshContent() {
            ipcRenderer.send("vue-fresh-content")
        },
        //后退
        goBack() {
            this.$router.back()
        },
        //前进
        goForward() {
            this.$router.forward();
        }

    }
};
</script>



<style lang="scss">
.s-content {
    width: 100%;
    height: 100%;
    .s-header {
        background: $gray-800;
        height: 60px;
        .header-left {
            height: 100%;
        }
        .header-right {
            height: 100%;
            display: flex;
            align-items: center;
            color: $white;
            .operation {
                margin-right: size(10);
                display: flex;
                height: 100%;
                align-items: center;
                .op_item {
                    width: size(30);
                    height: size(30);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: size(20);
                    border-radius: 50%;
                    &:hover {
                        background: $gray-600;
                        // color: $theme-color;
                    }
                }
            }
        }
        .el-dropdown {
            color: $white;
        }
    }
}
</style>
