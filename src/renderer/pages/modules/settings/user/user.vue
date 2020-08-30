/*
    创建者：shuxiaokai
    创建时间：2020-08-30 19:12
    模块名称：用户设置
    备注：xxxx
*/
<template>
    <div class="user-setting">
        <div class="back f-base my-5 hover-theme-color cursor-pointer">
            <span class="el-icon-back"></span>
            <span>返回上级</span>
        </div>
        <s-card shadow>
            <div class="base-info">
                <div class="w-50 flex0">
                    <h2>
                        <span>周杰伦</span>
                        <span class="f-bg el-icon-edit cursor-pointer hover-theme-color"></span>
                    </h2>
                    <div class="px-3">
                        <s-label-value label="部门：" value="测试部门" class="w-45"></s-label-value>
                        <s-label-value label="职位：" value="前端研发" class="w-45"></s-label-value>
                        <s-label-value label="手机号码：" value="15225255512" class="w-45"></s-label-value>
                        <s-label-value label="qq号码：" value="7811011211" class="w-45"></s-label-value>
                        <s-label-value label="登录名称：" value="shuxiaokai" class="w-45"></s-label-value>
                    </div>
                </div>
                <div class="w-50 flex0">
                    <el-divider content-position="left">账号绑定</el-divider>
                </div>
            </div>            
        </s-card>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    created() {

    },
    methods: {
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//

        //=====================================组件间交互====================================//  
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
    .user-setting {
        max-width: size(1440);
        margin: auto;
        .base-info {
            display: flex;
            align-items: center;
        }
    }
</style>
