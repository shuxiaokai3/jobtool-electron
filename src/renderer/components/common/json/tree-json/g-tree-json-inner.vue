/*
    创建者：shuxiaokai
    创建时间：2020-07-28 15:21
    模块名称：json类型数据展示，支持备注信息
    备注：xxxx
*/
<template>
    <div class="tree-json-inner">
        <span v-if="level === 0" class="symbol">{</span>
        <div v-for="(item, index) in data" :key="index" class="indent">
            <!-- 常规数据类型 -->
            <template v-if="item.type !== 'array' && item.type !== 'object' && item.value">
                <span>
                    <span v-if="!isArray" class="key">{{ item.key }}</span><span v-if="!isArray" class="symbol">:&nbsp;</span>
                    <!-- 对象 -->
                    <template v-if="item.type === 'object'">
                        <span class="symbol">{</span>
                        <s-tree-json :value-width="valueWidth" :data="item.children" :level="level + 1"></s-tree-json>
                        <span class="symbol">}</span>
                    </template>
                    <!-- 数组 -->
                    <template v-else-if="item.type === 'array'">
                        <span class="symbol">[</span>
                        <s-ellipsis-content :max-width="valueWidth" ref="comment" class="comment" :value="`//${item.description}`"></s-ellipsis-content>
                        <s-tree-json :value-width="valueWidth" :data="item.children" :level="level + 1"></s-tree-json>
                        <span class="symbol">]</span>
                    </template>
                    <!-- 常规数据 -->
                    <template v-else>
                        <s-ellipsis-content :max-width="valueWidth" v-if="item.type === 'string'" class="string-value" :value='`"${item.value}"`'></s-ellipsis-content>
                        <s-ellipsis-content :max-width="valueWidth" v-if="item.type === 'number'" class="number-value" :value="item.value"></s-ellipsis-content>
                        <s-ellipsis-content :max-width="valueWidth" v-if="item.type === 'boolean'" class="boolean-value" :value="item.value"></s-ellipsis-content>
                    </template>
                    <span class="symbol">,</span>
                    <s-ellipsis-content :max-width="valueWidth" v-show="item.type !== 'object' || item.type !== 'array'" ref="comment" class="comment" :value="`//${item.description}`"></s-ellipsis-content>
                    <span v-if="item.required" class="comment">(必填)</span>
                </span>                
            </template>
            <!-- 对象和数组类型 -->
            <template v-else-if="item.type === 'array'|| item.type === 'object'">
                <span>
                    <span v-if="!isArray" class="key">{{ item.key }}</span><span v-if="!isArray" class="symbol">:&nbsp;</span>
                    <template v-if="item.type === 'object'">
                        <span class="symbol">{</span>
                        <s-ellipsis-content :max-width="valueWidth" ref="comment" class="comment" :value="`//${item.description}`"></s-ellipsis-content>
                        <s-tree-json :value-width="valueWidth" :data="item.children" :level="level + 1"></s-tree-json>
                        <span class="symbol">}</span>
                    </template>
                    <template v-else-if="item.type === 'array'">
                        <span class="symbol">[</span>
                        <s-ellipsis-content :max-width="valueWidth" ref="comment" class="comment" :value="`//${item.description}`"></s-ellipsis-content>
                        <s-tree-json :value-width="valueWidth" :data="item.children" :level="level + 1" is-array></s-tree-json>
                        <span class="symbol">]</span>
                    </template>
                    <template v-else>
                        <s-ellipsis-content :max-width="valueWidth" v-if="item.type === 'string'" class="string-value" :value='`"${item.value}"`'></s-ellipsis-content>
                        <s-ellipsis-content :max-width="valueWidth" v-if="item.type === 'number'" class="number-value" :value="item.value"></s-ellipsis-content>
                        <s-ellipsis-content :max-width="valueWidth" v-if="item.type === 'boolean'" class="boolean-value" :value="item.value"></s-ellipsis-content>
                    </template>
                    <span class="symbol">,</span>
                </span> 
            </template>
        </div>
        <span v-if="level === 0" class="symbol">}</span>
    </div>
</template>

<script>
export default {
    name: "STreeJson",
    props: {
        data: {
            type: [Object, Array],
            default() {
                return {};
            }
        },
        level: {
            type: Number,
            default: 0
        },
        indent: {
            type: Number,
            default: 20
        },
        path: {
            type: String,
            default: ""
        },
        options: {
            type: Object,
            default() {
                return {
                    key: "key",
                    value: "value",
                    type: "type",
                    description: "description"
                }
            }
        },
        isArray: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ""
        },
        valueWidth: {
            type: String,
            default: "200px"
        },
    },
    watch: {
        data: {
            handler(val) {
                if (val && this.$refs["comment"] && this.$refs["comment"].length > 0) {
                    this.$refs["comment"].forEach(commentDom => {
                        // const previouseElementSiblingOffsetLeft = commentDom.$el.previousElementSibling.offsetLeft;
                        commentDom.$el.style.marginLeft = 5 + "px"
                    });
                }
            },
            deep: true
        }
    },
    data() {
        return { 
        };
    },
    mounted() {
        
    },
    methods: {
        
        //=====================================其他操作=====================================//

    }
};
</script>



<style lang="scss">
.tree-json-inner {

    .indent {
        padding-left: 2em;
    }
    .key {
        color: $blue,
    }
    .symbol {
        color: $gray-300;
    }
    .string-value {
        color: $orange;
        font-size: .9em;
    }
    .boolean-value {
        color: #499CB3;
        font-size: .9em;
    }
    .number-value {
        color: #80C0A8;
        font-size: .9em;
    }
    .comment {
        color: #6A9955;
    }

}

</style>
