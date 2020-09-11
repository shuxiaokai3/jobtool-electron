/*
    创建者：shuxiaokai
    创建时间：2020-07-30 17:31
    模块名称：json格式参数对比
    备注：xxxx
*/
<template>
    <div class="diff-json-wrap">
        <s-diff-json-inner :old-value="oldValue" :new-value="newValue"></s-diff-json-inner>
    </div>
</template>

<script>
import uuid from "uuid/v4"
export default {
    props: {
        oldValue: {
            type: [Object, Array],
            default() {
                return {};
            }
        },
        newValue: {
            type: [Object, Array],
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            
        };
    },
    
    created() {

    },
    methods: {
       
    }
};
</script>



<style lang="scss">
.diff-json-wrap {
    padding: size(10) size(10);
    position: relative; //递归组件只在外层添加relative，否则offsetleft取值会出现问题
    border-radius: $border-radius-sm;
    background: $gray-200;
    // background: #1E1E1E;
    // font-family: SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    // font-size: size(13);
    // max-height: size(400);
    // overflow-y: auto;
    // .operation {
    //     display: flex;
    //     align-items: center;
    //     justify-content: flex-end;
    //     height: size(20);
    //     color: $gray-500;
    //     font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    //     .item {
    //         cursor: pointer;
    //         user-select: none;
    //         margin-right: size(10);
    //         &.active {
    //             color: $green;
    //         }
    //     }
    // }
}
</style>
