/*
    创建者：shuxiaokai
    创建时间：2020-09-12 17:47
    模块名称：自动前后端代码生成
    备注：xxxx
*/
<template>
    <div class="easycode px-5 py-5">
        <div>
            <div class="f-bg text-bold">模型</div>
            <div class="item">
                <el-form ref="form" :model="formInfo" :rules="rules" label-width="100px">
                    <el-form-item label="模型名称：">
                        <el-input v-model="formInfo.name" name="name" size="mini" placeholder class="w-100" maxlength="100" clearable></el-input>
                    </el-form-item>
                </el-form>
                <s-params-tree title="字段信息：" :tree-data="treeData"></s-params-tree>
            </div>
        </div>
        <div></div>
        <div></div>
    </div>
</template>

<script>
import paramsTree from "./components/params-tree";
export default {
    components: {
        "s-params-tree": paramsTree,
    },
    data() {
        return {
            formInfo: {
                name: "", //模型名称
            },
            rules: {},
            treeData: [
                {
                    key: "name", 
                    type: "string",
                    default: "5d9024146b8c68a768716704",
                    required: true,
                    children: [],
                    comment: "名称",
                },
                {
                    key: "age", 
                    type: "number",
                    default: "5d9024146b8c68a768716704",
                    required: true,
                    children: [],
                    comment: "年龄",
                },
            ],
        };
    },
    created() {},
    methods: {
        //=====================================获取远程数据==================================//
        //=====================================前后端交互====================================//
        //=====================================组件间交互====================================//
        //=====================================其他操作=====================================//
    },
};
</script>



<style lang="scss">
.easycode {
    .item {
        width: 50%;
        max-width: size(800);
    }
}
</style>
