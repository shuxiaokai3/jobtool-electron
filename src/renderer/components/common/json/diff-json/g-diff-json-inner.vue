/*
    创建者：shuxiaokai
    创建时间：2020-09-11 17:09
    模块名称：
    备注：xxxx
*/
<template>
    <div class="diff-json-inner">
        <div v-for="(item, index) in newValue" :key="index" class="line">
            <div class="new">{{ item.key }}</div>
            <div class="old">2</div>            
        </div>
    </div>
</template>

<script>
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
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//

        //=====================================组件间交互====================================//  
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.diff-json-inner {
    // display: flex;
    .line {
        display: flex;
        align-items: center;
        height: size(20);
        &:hover {
            background: $gray-400;
        }
        .old {
            flex: 0 0 auto;
            width: 50%;
        }
        .new {
            flex: 0 0 auto;
            width: 50%;
        }        
    }

}
</style>
