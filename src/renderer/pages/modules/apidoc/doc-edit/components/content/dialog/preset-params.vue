/**
    创建者：shuxiaokai
    创建时间：2020-01-15 13:31"
    模块名称：预设参数curd弹窗
    备注：xxxx
*/
<template>
    <s-curd-model v-if="visible" title="快捷参数维护" left-width="45%" width="80%" @close="closeModel">
        <!-- 新增数据 -->
        <div slot="left" class="pr-2">
            <el-divider content-position="left">数据展示</el-divider>
            <s-table ref="table" url="/api/project/doc_preset_params_list" :params="{projectId: $route.query.id}">
                <el-table-column label="参数名称" align="center">
                    <template slot-scope="scope">
                        <el-input v-if="scope.row.__active" v-model="scope.row.name" size="mini" class="w-100" maxlength="8" clearable show-word-limit></el-input>
                        <span v-else>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建者名称" prop="creatorName" align="center"></el-table-column>
                <el-table-column label="参数类型" prop="presetParamsType" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.presetParamsType === 'request'" size="mini" type="success">请求参数</el-tag>
                        <el-tag v-if="scope.row.presetParamsType === 'response'" size="mini" type="primary">返回参数</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="handleChangeOpToEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="mini" @click="handleDelete(scope.row._id)">删除</el-button>
                    </template>
                </el-table-column>
                <el-button slot="operation" type="success" size="mini" @click="handleChangeOpToAdd">新增快捷参数</el-button>
            </s-table>
        </div>
        <!-- 数据展示 -->
        <div slot="right" v-loading="loading" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" class="ml-1 flex1">
            <el-divider v-if="operationType === 'add'" content-position="left">添加快捷参数</el-divider>
            <el-divider v-if="operationType === 'edit'" content-position="left">编辑快捷参数</el-divider>
            <el-form ref="form" :model="formInfo" :rules="rules" label-width="120px">
                <el-form-item label="参数名称：" prop="name">
                    <el-input v-model="formInfo.name" size="mini" placeholder="例如：默认返回值" class="w-100" maxlength="8" clearable show-word-limit></el-input>
                </el-form-item>
                <s-params-tree :tree-data="formInfo.presetParams" title="参数模板"></s-params-tree>
                <div class="d-flex j-end">
                    <el-button v-if="operationType === 'add'" :loading="loading2" type="success" size="mini" @click="handleAddPresetParams">确认新增</el-button>
                    <el-button v-else-if="operationType === 'edit'" :loading="loading2" type="warning" size="mini" @click="handleEditPresetParams">确认编辑</el-button>
                </div>
            </el-form>  
        </div>
    </s-curd-model>
</template>

<script>
import paramsTree from "../components/params-tree"
import uuid from "uuid/v4"
export default {
    components: {
        "s-params-tree": paramsTree
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        type: { //快捷参数类型
            type: String,
            default: ""
        },
    },
    data() {
        return {
            //=====================================请求参数====================================//
            formInfo: {
                _id: "",
                name: "", //-------------------参数名称
                presetParams: [
                    {
                        id: uuid(),
                        key: "", //--------------请求参数键
                        value: "", //------------请求参数值
                        type: "string", //-------------请求参数值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ],
            },
            //=====================================验证参数====================================//
            rules: {
                name: [{ required: true, message: "请输入服务器名称", trigger: "blur" }],
            },
            //=====================================其他参数====================================//

            operationType: "add", //----------------操作类型， add(新增) edit(编辑)
            loading: false, //----------------------表格加载效果
            loading2: false, //---------------------添加按钮加载效果
        };
    },
    created() {
        
    },
    methods: {
        //=====================================表格相关====================================//
        getData() {
            this.$refs["table"].getData();
        },
        //=====================================前后端交互操作====================================//
        //新增表格数据
        handleAddPresetParams() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    const params = {
                        name: this.formInfo.name,
                        presetParamsType: this.type,
                        projectId: this.$route.query.id,
                        items: this.formInfo.presetParams,
                    };
                    this.loading2 = true;
                    this.axios.post("/api/project/doc_preset_params", params).then(res => {
                        this.getData();
                        this.$emit("success")
                    }).catch(err => {
                        console.error(err);
                    }).finally(() => {
                        this.loading2 = false;
                    });
                } 
            });
        },
        //修改快捷操作
        handleEditPresetParams() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    const params = {
                        _id: this.formInfo._id,
                        name: this.formInfo.name,
                        presetParamsType: this.type,
                        items: this.formInfo.presetParams,
                    };
                    this.loading2 = true;
                    this.axios.put("/api/project/doc_preset_params", params).then(res => {
                        this.getData();
                        this.$emit("success")
                    }).catch(err => {
                        console.error(err);
                    }).finally(() => {
                        this.loading2 = false;
                    });
                } 
            });
        },
        //删除
        handleDelete(_id) {
            this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.axios.delete("/api/project/doc_preset_params", { data: { ids: [_id] }}).then(res => {
                    this.$message.success("删除成功");
                    this.getData();
                    this.$emit("success")
                }).catch(err => {
                    this.$errorThrow(err, this);
                });  
            }).catch(() => {
                    
            });
        },
        //=====================================操作====================================//
        //修改
        handleChangeOpToEdit(row) {
            this.operationType= "edit";
            this.formInfo._id = row._id;
            this.formInfo.name = row.name;
            this.formInfo.presetParams = row.items;
        },
        //新增
        handleChangeOpToAdd() {
            if (this.operationType === "add") {
                this.$message.warning("在右侧进行新增");
                return
            }
            this.operationType = "add";
            this.formInfo.name = "";
            this.formInfo.presetParams = [this.generateParams()];
        },
        //=====================================其他操作====================================//
        generateParams(type = "string") {
            return {
                id: uuid(),
                key: "", //--------------请求参数键
                value: "", //------------请求参数值
                type, //-----------------请求参数值类型
                description: "", //------描述
                required: true, //-------是否必填
                children: [], //---------子参数
            }
        },
        //关闭弹窗
        closeModel() {
            this.$emit("update:visible", false);
        },
    }
};
</script>

