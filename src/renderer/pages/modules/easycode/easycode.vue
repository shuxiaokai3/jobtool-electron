/*
    创建者：shuxiaokai
    创建时间：2020-09-12 17:47
    模块名称：自动前后端代码生成
    备注：xxxx
*/
<template>
    <div class="easycode px-5 py-5">
        <s-fieldset title="模型">
            <div>
                <s-label-value label="模型名称：" label-width="120px">
                    <el-input v-model="formInfo.name" name="name" size="mini" placeholder class="w-100" maxlength="100" clearable></el-input>
                </s-label-value>
                <s-params-tree title="字段信息：" label-width="120px" :tree-data="treeData"></s-params-tree>
            </div>            
        </s-fieldset>
        <pre>{{ modelValue }}</pre>
    </div>
</template>

<script>
import paramsTree from "./components/params-tree";
export default {
    components: {
        "s-params-tree": paramsTree,
    },
    computed: {
        modelValue() {
            console.log(this.treeData)
            const result = this.convertTreeDataToMongooseModelData();
            return result;
        },
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
                    key: "", 
                    type: "String",
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
        convertTreeDataToMongooseModelData() {
            const result = {};
            const copyTreeData = JSON.parse(JSON.stringify(this.treeData));
            const foo = (treeData, result) => {
                for (let i = 0; i < treeData.length; i++) {
                    const el = treeData[i];
                    const key = el.key; //key
                    const type = el.type; //类型
                    const defaultValue = el.default; //默认值
                    const comment = el.comment; //注释
                    const required = el.required; //是否必填
                    let schemaStr = ""; //schema内部数据
                    if (key === "") {
                        continue;
                    }
                    //=========================================================================//
                    if (type === "String") { //字符串
                        schemaStr += this.convertString(el);
                    } else if (type === "Number") {
                        schemaStr += this.convertNumber(el);
                    } else if (type === "Boolean") {
                        schemaStr += this.convertBoolean(el);
                    }
                    //=====================================数字====================================//

                    console.log(schemaStr)
                }
            }
            foo(copyTreeData, result);
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
                numberLimitStr += `${numberLimit[i]}: true,
                        `
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
            result = `
                ${el.key}: { //${el.comment}
                    type: ${el.type},
                    ${el.default ? `default: "${el.default}",` : ""}
                    ${numberLimitStr ? numberLimitStr : ""}
                    ${(numberMinLength != null) ? `min: ${numberMinLength},` : ""}
                    ${(numberMaxLength != null) ? `max: ${numberMaxLength},` : ""}
                    ${numberEnumStr ? `enum: [${numberEnumStr}],` : ""}
                    ${el.required ? `required: true,` : ""}
                },
            `;
            return result;
        },
        //转换字符串类型
        convertString(el) {
            let result = "";
            const stringLimit = el.stringOp.limit; //字符串限制
            const stringEnum= el.stringOp.enum.split(","); //字符串枚举
            const stringMaxLength = el.stringOp.maxlength; //字符串最大值
            const stringMinLength = el.stringOp.minlength; //字符串最小值
            let stringLimitStr = "";
            let stringEnumStr = "";
            //字符串限制条件
            for (let i = 0; i < stringLimit.length; i++) {
                stringLimitStr += `${stringLimit[i]}: true,
                        `
            }
            //字符串枚举
            for (let i = 0; i < stringEnum.length; i++) {
                if (i === stringEnum.length - 1) {
                    stringEnumStr += `"${stringEnum[i]}"`
                } else {
                    stringEnumStr += `"${stringEnum[i]}",`
                }
            }
            result = `
                ${el.key}: { //${el.comment}
                    type: ${el.type},
                    ${el.default ? `default: "${Number(el.default)}",` : ""}
                    ${stringLimitStr ? stringLimitStr : ""}
                    ${(stringMinLength != null) ? `minlength: ${stringMinLength},` : ""}
                    ${(stringMaxLength != null) ? `maxlength: ${stringMaxLength},` : ""}
                    ${stringEnumStr ? `enum: [${stringEnumStr}],` : ""}
                    ${el.required ? `required: true,` : ""}
                },
            `;
            return result;
        },
        //转换布尔类型
        convertBoolean(el) {
            let result = "";
            result = `
                ${el.key}: { //${el.comment}
                    type: ${el.type},
                    ${el.default ? `default: ${!!el.default},` : ""}
                    ${el.required ? `required: true,` : ""}
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
                    ${el.default ? `default: ${!!el.default},` : ""}
                    ${el.required ? `required: true,` : ""}
                },
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
}
</style>
