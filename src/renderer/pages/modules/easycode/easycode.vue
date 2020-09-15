/*
    创建者：shuxiaokai
    创建时间：2020-09-12 17:47
    模块名称：自动前后端代码生成
    备注：xxxx
*/
<template>
    <div class="easycode px-5 py-5">
        <s-fieldset title="基本信息">
            <s-label-value label="模型名称：" label-width="120px">
                <el-input v-model="formInfo.modelName" size="mini" placeholder="例如：doc,userInfo 驼峰命名" class="w-100" maxlength="100" clearable></el-input>
            </s-label-value>
            <s-label-value label="模型描述：" label-width="120px">
                <el-input v-model="formInfo.description" size="mini" placeholder="例如：企业用户模型" class="w-100" maxlength="100" clearable></el-input>
            </s-label-value>
            <s-label-value label="文件路径：" label-width="120px">
                <el-input v-model="formInfo.path" size="mini" placeholder="使用/分隔：api/user" class="w-100" maxlength="100" clearable></el-input>
            </s-label-value>
            <s-label-value label="开发者：" label-width="120px">
                <el-input v-model="formInfo.creator" size="mini" placeholder="例如：shuxiaokai" class="w-100" maxlength="100" clearable></el-input>
            </s-label-value>
        </s-fieldset>
        <s-fieldset title="模型">
            <div>
                <s-params-tree title="字段信息：" label-width="120px" :tree-data="treeData"></s-params-tree>
            </div>            
        </s-fieldset>
        <s-card>
            <div class="d-flex j-between">
                <div class="w-30">
                    <h2>model</h2>
                    <div class="code-area scroll-y-400">
                        <pre class="">{{ modelValue }}</pre>
                        <div class="operate green cursor-pointer">复制</div>
                    </div>
                </div>
                <div class="w-30">
                    <h2>controller</h2>
                    <el-checkbox-group v-model="formInfo.curd">
                        <el-checkbox label="create">新增</el-checkbox>
                        <el-checkbox label="update">修改</el-checkbox>
                        <el-checkbox label="readById">单个查询</el-checkbox>
                        <el-checkbox label="readList">列表查询</el-checkbox>
                        <el-checkbox label="delete">删除</el-checkbox>
                    </el-checkbox-group>
                    <div class="code-area scroll-y-400">
                        <pre class="">{{ controllerValue }}</pre>
                        <!-- <div style="height: 999px"></div> -->
                        <div class="operate hover-green cursor-pointer">复制</div>
                    </div>
                </div>
                <div class="w-30">
                    <h2>service</h2>
                    <div class="code-area scroll-y-400">
                        <pre class="">{{ modelValue }}</pre>
                        <span class="operate hover-green cursor-pointer">复制</span>
                    </div>
                </div>
            </div>
        </s-card>
    </div>
</template>

<script>
import paramsTree from "./components/params-tree";
import camelCase from "camelcase"
import beautify from "js-beautify"
export default {
    components: {
        "s-params-tree": paramsTree,
    },
    computed: {
        modelValue() {
            const result = this.convertTreeDataToMongooseModelData();
            return result;
        },
        controllerValue() {
            const result = this.convertTreeDataToMongooseControllerData();
            return result;
        },
    },
    data() {
        return {
            formInfo: {
                modelName: "user", //模型名称
                creator: "shuxiaokai", //创建者名称
                description: "用户",
                curd: ["create", "update", "readList", "readById", "delete"], //增删改查, create update readList readById delete 
                path: "apidoc/docs"
            },
            rules: {},
            listParams: [
                {
                    key: "pageSize",
                    type: "string",
                    comment: "每页数据大小",
                    required: true,
                    default: "10"
                },
                {
                    key: "pageNum",
                    type: "string",
                    comment: "当前页码",
                    required: false,
                    default: "1"
                },
                {
                    key: "startTime",
                    type: "string",
                    comment: "起始日期",
                    required: false,
                    default: "1"
                },
                {
                    key: "endTime",
                    type: "string",
                    comment: "结束日期",
                    required: false,
                    default: "1"
                }
            ],
            treeData: [
                {
                    key: "name", 
                    type: "String",
                    default: "shu",
                    required: true,
                    children: [],
                    comment: "名称",
                    stringOp: {
                        limit: [],
                        minlength: 0,
                        maxlength: 255,
                        enum: "a,b,c",
                        match: null,
                    },
                    numberOp: {
                        limit: [],
                        min: 0,
                        max: 999999,
                        enum: "",
                    },
                    DateOp: {},
                },
                {
                    key: "age", 
                    type: "Number",
                    default: "22",
                    required: true,
                    children: [],
                    comment: "年龄",
                    stringOp: {
                        limit: [],
                        minlength: 0,
                        maxlength: 255,
                        enum: "",
                        match: null,
                    },
                    numberOp: {
                        limit: [],
                        min: 0,
                        max: 999999,
                        enum: "",
                    },
                    DateOp: {},
                },
                {
                    key: "sex", 
                    type: "Object",
                    default: "",
                    required: true,
                    children: [],
                    comment: "",
                    stringOp: {
                        limit: [],
                        minlength: 0,
                        maxlength: 255,
                        enum: "",
                        match: null,
                    },
                    numberOp: {
                        limit: [],
                        min: 0,
                        max: 999999,
                        enum: "",
                    },
                    DateOp: {},
                },
            ],
        };
    },
    created() {},
    methods: {
        //=====================================Model转换====================================//
        //转换参数为mongooseModel
        convertTreeDataToMongooseModelData() {
            let result = "";
            const copyTreeData = JSON.parse(JSON.stringify(this.treeData));
            const foo = (treeData) => {
                let schemaStr = ""; //schema内部数据
                for (let i = 0; i < treeData.length; i++) {
                    const el = treeData[i];
                    const key = el.key; //key
                    const type = el.type; //类型
                    const defaultValue = el.default; //默认值
                    const comment = el.comment; //注释
                    const required = el.required; //是否必填
                    if (key === "") {
                        continue;
                    }
                    //=========================================================================//
                    if (type === "String") { //字符串
                        schemaStr += this.convertString(el);
                    } else if (type === "Number") { //数字
                        schemaStr += this.convertNumber(el);
                    } else if (type === "Boolean") { //布尔值
                        schemaStr += this.convertBoolean(el);
                    } else if (type === "ObjectId") { //objectId
                        schemaStr += this.convertObjectId(el);
                    } else if (type === "Object") { //对象
                        schemaStr += `
                            ${el.key}: { //${el.comment}
                                ${foo(treeData[i].children)}
                            },
                        `;
                    } else if (type === "Array") { //数组
                        schemaStr += `
                            ${el.key}: [{ //${el.comment}
                                ${foo(treeData[i].children)}
                            }],
                        `;
                    }
                }
                return schemaStr;
            }
            result = foo(copyTreeData);
            result = `/**\n    @description  ${this.formInfo.description}模型\n    @author       ${this.formInfo.creator}\n    @create       ${new Date().toLocaleString()}\n*/\n
                module.exports = app => {
                    const mongoose = app.mongoose;
                    const Schema = mongoose.Schema;
                    const ${camelCase(this.formInfo.modelName)}Schema = new Schema({${result}}, { timestamps: true });
                    return mongoose.model("${this.formInfo.modelName}", ${camelCase(this.formInfo.modelName)}Schema);
                };
            `
            result = beautify(result, { indent_size: 4, "end-with-newline": true, preserve_newlines: false })
            return result;
        },
        //转换数字类型
        convertNumber(el) {
            let result = "";
            const numberLimit = el.numberOp.limit; //数字限制
            const numberMaxLength = el.numberOp.max; //数字最大值
            const numberMinLength = el.numberOp.min; //数字最小值
            const numberEnum = el.numberOp.enum.split(","); //数字枚举值
            let numberLimitStr = "";
            let numberEnumStr = "";
            //数字类型限制条件
            for (let i = 0; i < numberLimit.length; i++) {
                numberLimitStr += `${numberLimit[i]}: true,`
            }
            //数字枚举
            for (let i = 0; i < numberEnum.length; i++) {
                if (isNaN(Number(numberEnum[i]))) {
                    console.warn("数字枚举值只能为数字")
                }
                if (i === numberEnum.length - 1) {
                    numberEnumStr += `${numberEnum[i]}`
                } else {
                    numberEnumStr += `${numberEnum[i]},`
                }
            }
            const a = `${el.default ? `default: "${Number(el.default)}",` : ""}`;
            const b = `${numberLimitStr ? numberLimitStr : ""}`;
            const c = `${(numberMinLength != null) ? `min: ${numberMinLength},` : ""}`;
            const d = `${(numberMaxLength != null) ? `max: ${numberMaxLength},` : ""}`;
            const e = `${numberEnumStr ? `enum: [${numberEnumStr}],` : ""}`;
            const f = `${el.required ? `required: true,` : ""}`;
            result = `
                ${el.key}: { //${el.comment}
                    type: ${el.type},${a}${b}${c}${d}${e}${f}
                },
            `;
            return result;
        },
        //转换字符串类型
        convertString(el) {
            let result = "";
            const stringLimit = el.stringOp.limit; //字符串限制
            const stringEnum= el.stringOp.enum.trim() === "" ? [] : el.stringOp.enum.split(","); //字符串枚举
            const stringMaxLength = el.stringOp.maxlength; //字符串最大值
            const stringMinLength = el.stringOp.minlength; //字符串最小值
            let stringLimitStr = "";
            let stringEnumStr = "";
            //字符串限制条件
            for (let i = 0; i < stringLimit.length; i++) {
                stringLimitStr += `${stringLimit[i]}: true,`
            }
            //字符串枚举
            for (let i = 0; i < stringEnum.length; i++) {
                if (i === stringEnum.length - 1) {
                    stringEnumStr += `"${stringEnum[i]}"`
                } else {
                    stringEnumStr += `"${stringEnum[i]}",`
                }
            }
            const a = `${el.default ? `default: "${el.default}",` : ""}`;
            const b = `${stringLimitStr ? stringLimitStr : ""}`;
            const c = `${(stringMinLength != null) ? `minlength: ${stringMinLength},` : ""}`;
            const d = `${(stringMaxLength != null) ? `maxlength: ${stringMaxLength},` : ""}`;
            const e = `${(stringEnum.length > 0) ? `enum: [${stringEnumStr}],` : ""}`;
            const f = `${el.required ? `required: true,` : ""}`;
            result = `
                ${el.key}: { //${el.comment}
                    type: ${el.type},${a}${b}${c}${d}${e}${f}
                },
            `;
            return result;
        },
        //转换布尔类型
        convertBoolean(el) {
            let result = "";
            const a = `${el.default ? `default: ${!!el.default},` : ""}`;
            const b = `${el.required ? `required: true,` : ""}`;
            result = `
                ${el.key}: { //${el.comment}
                    type: ${el.type},${a}${b}
                },
            `;
            return result;
        },
        //转换为objectId
        convertObjectId(el) {
            let result = "";
            result = `
                ${el.key}: { //${el.comment}
                    type: mongoose.Schema.Types.ObjectId,
                    ${el.required ? `required: true,` : ""}
                },
            `;
            return result;
        },
        //=====================================Controller转换====================================//
        convertTreeDataToMongooseControllerData() {
            const createControllerStr = (this.formInfo.curd.includes("create")) ? this.generateCreateController() : "";
            const updateControllerStr = (this.formInfo.curd.includes("update")) ? this.generateUpdateController() : "";
            const readListControllerStr = (this.formInfo.curd.includes("readList")) ? this.generateReadListController() : "";
            const readByIdControllerStr = (this.formInfo.curd.includes("readById")) ? this.generateReadByIdController() : "";
            const deleteControllerStr = (this.formInfo.curd.includes("delete")) ? this.generateDeleteController() : "";

            
            let result = `
                /** 
                    @description  ${this.formInfo.description}控制器
                    @author       ${this.formInfo.creator}
                    @create       ${new Date().toLocaleString()}
                */
                const Controller = require("egg").Controller;
                class ${camelCase(this.formInfo.modelName, { pascalCase: true })}Controller extends Controller {
                    ${createControllerStr}
                    ${updateControllerStr}
                    ${readListControllerStr}
                    ${readByIdControllerStr}
                    ${deleteControllerStr}
                }
                module.exports = ${camelCase(this.formInfo.modelName, { pascalCase: true })}Controller;
            `;
            result = beautify(result, { indent_size: 4, "end-with-newline": true, preserve_newlines: false })
            return result;
        },
        //新增
        generateCreateController() {
            const copyTreeData = JSON.parse(JSON.stringify(this.treeData));
            let comments = "";
            let reqRule = "";
            for (let i = 0; i < copyTreeData.length; i++) {
                const el = copyTreeData[i];
                const key = el.key; //key
                const type = el.type; //类型
                const defaultValue = el.default; //默认值
                const comment = el.comment; //注释
                const required = el.required; //是否必填
                if (key === "") continue;
                comments += `\n    @param {${type.toLowerCase()}${required ? "" : "?"}}        ${key} ${comment}`;
                reqRule += `${key}: { type: "${type.toLowerCase()}" },`;
            }
            const desc = this.formInfo.description;
            const creator = this.formInfo.creator;
            const space = " ".repeat(4);
            const time = new Date().toLocaleString();
            let result = `\n/**\n${space}@description${space}新增${desc}\n${space}@author${space}${space} ${creator}\n${space}@create${space}${space} ${time}${comments}\n${space}@return${space}null\n*/
            async ${camelCase(`create_${this.formInfo.modelName}`)}() {
                try {
                    const params = this.ctx.request.body;
                    const reqRule = {
                        ${reqRule}
                    };
                    this.ctx.validate(reqRule, params);
                    const result = await this.ctx.service.${this.formInfo.path.split("/").join(".")}.${camelCase(`create_${this.formInfo.modelName}`)}(params);
                    this.ctx.helper.successResponseData(result);
                } catch (error) {
                    this.ctx.helper.throwError(error);
                    return;
                }
            }
            `;
            return result;
        },
        //修改
        generateUpdateController() {
            const copyTreeData = JSON.parse(JSON.stringify(this.treeData));
            let comments = "\n    @param {String}         _id 数据id";
            let reqRule = `_id: { type: "string" },`;
            for (let i = 0; i < copyTreeData.length; i++) {
                const el = copyTreeData[i];
                const key = el.key; //key
                const type = el.type; //类型
                const defaultValue = el.default; //默认值
                const comment = el.comment; //注释
                const required = el.required; //是否必填
                if (key === "") continue;
                comments += `\n    @param {${type.toLowerCase()}?}        ${key} ${comment}`;
                reqRule += `${key}: { type: "${type.toLowerCase()}", required: false },`;
            }
            const desc = this.formInfo.description;
            const creator = this.formInfo.creator;
            const space = " ".repeat(4);
            const time = new Date().toLocaleString();
            let result = `\n/**\n${space}@description${space}修改${desc}\n${space}@author${space}${space} ${creator}\n${space}@create${space}${space} ${time}${comments}\n${space}@return${space}null\n*/
            \nasync ${camelCase(`update_${this.formInfo.modelName}`)}() {
                try {
                    const params = this.ctx.request.body;
                    const reqRule = {
                        ${reqRule}
                    };
                    this.ctx.validate(reqRule, params);
                    const result = await this.ctx.service.${this.formInfo.path.split("/").join(".")}.${camelCase(`update_${this.formInfo.modelName}`)}(params);
                    this.ctx.helper.successResponseData(result);
                } catch (error) {
                    this.ctx.helper.throwError(error);
                    return;
                }
            }
            `;
            return result;
        },
        //列表查询
        generateReadListController() {
            let comments = "";
            let reqRule = ``;
            for (let i = 0; i < this.listParams.length; i++) {
                const el = this.listParams[i];
                const key = el.key; //key
                const type = el.type; //类型
                const defaultValue = el.default; //默认值
                const comment = el.comment; //注释
                let defaultValueStr = "";
                if (type === "string") {
                    defaultValueStr = `"${defaultValue}"`;
                }
                const required = el.required; //是否必填
                comments += `\n    @param {${type.toLowerCase()}${(!required || defaultValue) ? "?" : ""}}        ${key} ${comment}`;
                reqRule += `${key}: { type: "${type.toLowerCase()}", ${(!required || defaultValue) ? "required: false," : ""} ${defaultValue ? `default: ${defaultValueStr}` : ""}},`;
            }
            const desc = this.formInfo.description;
            const creator = this.formInfo.creator;
            const space = " ".repeat(4);
            const time = new Date().toLocaleString();
            let result = `\n/**\n${space}@description${space}以列表形式获取${desc}\n${space}@author${space}${space} ${creator}\n${space}@create${space}${space} ${time}${comments}\n${space}@return${space}null\n*/
            \nasync ${camelCase(`read_${this.formInfo.modelName}_list`)}() {
                try {
                    const params = this.ctx.request.query;
                    const reqRule = {
                        ${reqRule}
                    };
                    this.ctx.validate(reqRule, params);
                    const result = await this.ctx.service.${this.formInfo.path.split("/").join(".")}.${camelCase(`read_${this.formInfo.modelName}_list`)}(params);
                    this.ctx.helper.successResponseData(result);
                } catch (error) {
                    this.ctx.helper.throwError(error);
                    return;
                }
            }
            `;
            return result;
        },
        //根据id查询详情
        generateReadByIdController() {
            let comments = `\n    @param {string}        _id 详情数据id`;
            let reqRule = `_id: { type: "string" }`;
            const desc = this.formInfo.description;
            const creator = this.formInfo.creator;
            const space = " ".repeat(4);
            const time = new Date().toLocaleString();
            let result = `\n/**\n${space}@description${space}根据id查询${desc}\n${space}@author${space}${space} ${creator}\n${space}@create${space}${space} ${time}${comments}\n${space}@return${space}null\n*/
            \nasync ${camelCase(`read_${this.formInfo.modelName}_byId`)}() {
                try {
                    const params = this.ctx.request.query;
                    const reqRule = {
                        ${reqRule}
                    };
                    this.ctx.validate(reqRule, params);
                    const result = await this.ctx.service.${this.formInfo.path.split("/").join(".")}.${camelCase(`read_${this.formInfo.modelName}_byId`)}(params);
                    this.ctx.helper.successResponseData(result);
                } catch (error) {
                    this.ctx.helper.throwError(error);
                    return;
                }
            }
            `;
            return result;
        },
        //删除
        generateDeleteController() {
            let comments = `\n    @param {array}        ids 需要删除数据id数组`;
            let reqRule = `ids: { type: "array" }`;
            const desc = this.formInfo.description;
            const creator = this.formInfo.creator;
            const space = " ".repeat(4);
            const time = new Date().toLocaleString();
            let result = `\n/**\n${space}@description${space}根据id删除${desc}\n${space}@author${space}${space} ${creator}\n${space}@create${space}${space} ${time}${comments}\n${space}@return${space}null\n*/
            \nasync ${camelCase(`delete_${this.formInfo.modelName}`)}() {
                try {
                    const params = this.ctx.request.body;
                    const reqRule = {
                        ${reqRule}
                    };
                    this.ctx.validate(reqRule, params);
                    const result = await this.ctx.service.${this.formInfo.path.split("/").join(".")}.${camelCase(`delete_${this.formInfo.modelName}`)}(params);
                    this.ctx.helper.successResponseData(result);
                } catch (error) {
                    this.ctx.helper.throwError(error);
                    return;
                }
            }
            `;
            return result;
        },
    },
};
</script>



<style lang="scss">
.easycode {
    .item {
        width: 50%;
        max-width: size(800);
    }
    .code-area {
        position: relative;
        .operate {
            position: sticky;
            top: 20px;
            // right: size(10);
        }
    }
}
</style>
