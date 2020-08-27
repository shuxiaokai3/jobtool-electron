/*
    创建者：shuxiaokai
    创建时间：2020-07-06 17:57
    模块名称：文档书写区域区域
    备注：xxxx
*/
<template>
    <div v-if="tabs && tabs.length > 0" class="view-content d-flex" tabindex="0">
        <div v-loading="loading2" :element-loading-text="randomTip()" element-loading-background="rgba(255, 255, 255, 0.9)" class="border-right-teal w-65">
            <!-- 基本配置 -->
            <div class="request mb-2">
                <!-- <div class="d-flex a-center">
                    <div>
                        <el-radio-group v-model="request.url.host" size="mini">
                            <el-popover placement="top-start" trigger="hover" :close-delay="0" :content="origin">
                                <el-radio slot="reference" :label="origin" border>本地</el-radio>
                            </el-popover>
                            <el-popover v-for="(item, index) in hostEnum" :key="index" :close-delay="0" placement="top-start" trigger="hover" :content="item.url">
                                <el-radio slot="reference" :label="item.url" border>{{ item.name }}</el-radio>
                            </el-popover>
                        </el-radio-group>
                        <el-button type="text" size="small" @click="dialogVisible = true;">域名维护</el-button>
                    </div>
                    <el-button v-if="!loading3" type="success" size="small" @click="sendRequest">发送请求</el-button>
                    <el-button v-if="loading3" type="danger" size="small" @click="stopRequest">取消请求</el-button>
                    <el-button type="primary" size="small" @click="dialogVisible3 = true">修改记录</el-button>
                </div> -->
            </div>
            <s-collapse title="基本信息" class="baseInfo">
                <div>
                    <div class="my-2 d-flex a-center">
                        <span class="flex0">请求地址：</span>
                        <s-ellipsis-content :value="request.url.host + request.url.path" max-width="100%"></s-ellipsis-content>
                    </div>
                    <div class="my-2">
                        <span>请求方式：</span>
                        <span class="green">{{ request.methods.toUpperCase() }}</span>
                    </div>
                    <div class="my-2">
                        <span>文档id：</span>
                        <span v-copy="currentSelectDoc._id" class="cursor-pointer theme-color">{{ currentSelectDoc._id }}</span>
                        <span v-copy="currentSelectDoc._id" class="cursor-pointer">(点击复制)</span>
                    </div>
                </div>
            </s-collapse>
            <!-- 请求参数 -->
            <div class="params-wrap">
                <s-collapse title="请求头">
                    <template v-if="request.header.length > 1">
                        <div v-for="(item, index) in request.header" :key="index" class="d-flex a-center mt">
                            <span v-if="item.key" class="flex0">{{ item.key }}：</span>
                            <s-ellipsis-content :value="item.value" :max-width="200"></s-ellipsis-content>
                        </div>
                    </template>
                    <div v-else class="f-xs gray-500">暂无数据</div>
                </s-collapse>
                <s-collapse title="请求参数">
                    <s-tree-json2 :data="request.requestParams"></s-tree-json2>
                </s-collapse>
                <s-collapse title="响应参数">
                    <s-tree-json2 :data="request.responseParams"></s-tree-json2>
                </s-collapse>
            </div>            
        </div>
        <div class="w-35 flex1">
            <s-response ref="response" :request-data="request"></s-response>
        </div>
        <s-history-dialog v-if="dialogVisible3" :visible.sync="dialogVisible3"></s-history-dialog>
        <s-host-manage v-if="dialogVisible" :visible.sync="dialogVisible" @change="getHostEnum"></s-host-manage>
    </div>
    <div v-else></div>
</template>

<script>
import axios from "axios" 
import response from "./components/response"
import hostManage from "./dialog/host-manage"
import historyDialog from "./dialog/history"
import { dfsForest, findParentNode } from "@/lib/utils"
import uuid from "uuid/v4"
import qs from "qs"
const CancelToken = axios.CancelToken;
export default {
    components: {
        "s-host-manage": hostManage,
        "s-response": response,
        "s-history-dialog": historyDialog,
    },
    data() {
        return {
            //=====================================请求基本信息====================================//
            request: {
                methods: "get", //---------------请求方式
                requestType: "query", //
                url: {
                    host: "", //-----------------主机(服务器)地址
                    path: "", //-----------------接口路径
                }, //----------------------------请求地址信息
                requestParams: [
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
                responseParams: [
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
                header: [
                    {
                        id: uuid(),
                        key: "", //--------------请求头键
                        value: "", //------------请求头值
                        type: "string", //-------请求头值类型
                        description: "", //------描述
                        required: true, //-------是否必填
                        children: [], //---------子参数
                    }
                ], //----------------------------请求头信息
                description: "在这里输入文档描述", //--------------请求描述
                _description: "", //-------------请求描述拷贝
                _variableChange: true, //----------hack强制触发request数据发生改变
            },
            origin: location.origin,
            //=====================================域名相关====================================//
            hostEnum: [], //---------------------域名列表
            //=====================================其他参数====================================//
            cancel: [], //-----------------------需要取消的接口
            loading: false, //-------------------保存接口
            loading2: false, //------------------获取文档详情接口
            loading3: false, //------------------发送请求状态
            dialogVisible: false, //-------------域名维护弹窗
            dialogVisible2: false, //------------全局变量管理弹窗
            dialogVisible3: false, //------------历史记录弹窗
            ready: false, //---------------------是否完成第一次数据请求
        };
    },
    computed: {
        currentSelectDoc() { //当前选中的doc
            return this.$store.state.apidoc.activeDoc[this.$route.query.id];
        },
        tabs() { //全部tabs
            return this.$store.state.apidoc.tabs[this.$route.query.id];
        },
        requestParams() {
            const copyData = JSON.parse(JSON.stringify(this.request.requestParams)); //扁平数据拷贝
            dfsForest(copyData, {
                rCondition(value) {
                    return value ? value.children : null;
                },
                rKey: "children",
                hooks: (val, i, forestData, parent) => {
                    if (val && !val._select) {
                        if (!parent) {
                            copyData.splice(i, 1);
                        } else {
                            parent.children.splice(i, 1);
                        }
                    }
                }
            });
            return copyData;
        },
    },
    watch: {
        currentSelectDoc: {
            handler(val, oldVal) {
                if (val) {
                    if (!oldVal || val._id !== oldVal._id) {
                        this.$store.commit("apidocRules/resetCondition");
                        this.getDocDetail();
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
        this.getHostEnum(); //获取host枚举值
    },
    methods: {
        //=====================================获取数据====================================//
        //获取文档详情
        getDocDetail() {
            if (!this.currentSelectDoc || !this.currentSelectDoc._id) { //没有id不请求数据
                return
            }
            const params = {
                _id: this.currentSelectDoc._id
            };
            if (this.cancel.length > 0) {
                this.cancel.forEach(c => {
                    c("取消请求");
                })
            }
            setTimeout(() => { //hack让请求加载不受取消影响
                this.loading2 = true;
                this.ready = false;
            })
            this.axios.get("/api/project/doc_detail", {
                params,
                cancelToken: new CancelToken((c) => {
                    this.cancel.push(c);
                })
            }).then(res => {
                if (res === undefined) { //取消接口
                    return
                }
                if (res.data === null) { //接口不存在提示用户删除接口
                    this.confirmInvalidDoc();
                    return;
                }
                this.ready = true;
                Object.assign(this.request, res.data.item);
                this.request.requestParams.forEach(val => this.$set(val, "id", val._id))
                this.request.responseParams.forEach(val => this.$set(val, "id", val._id))
                this.request.header.forEach(val => this.$set(val, "id", val._id))


                const reqParams = this.request.requestParams;
                const resParams = this.request.responseParams;
                const headerParams = this.request.header;
                const reqParamsLen = this.request.requestParams.length;
                const resParamsLen = this.request.responseParams.length;
                const headerParamsLen = this.request.header.length;
                const reqLastItemIsEmpty = (reqParams[reqParamsLen - 1] && reqParams[reqParamsLen - 1].key === "" && reqParams[reqParamsLen - 1].value === "");
                const resLastItemIsEmpty = (resParams[resParamsLen - 1] && resParams[resParamsLen - 1].key === "" && resParams[resParamsLen - 1].value === "");
                const headerLastItemIsEmpty = (headerParams[headerParamsLen - 1] && headerParams[headerParamsLen - 1].key === "" && headerParams[headerParamsLen - 1].value === "");
                if (reqParamsLen === 0 || !reqLastItemIsEmpty) this.request.requestParams.push(this.generateParams());
                if (resParamsLen === 0 || !resLastItemIsEmpty) this.request.responseParams.push(this.generateParams());
                if (headerParamsLen === 0 || !headerLastItemIsEmpty) this.request.header.push(this.generateParams());
                if (this.request.url.host === "") this.request.url.host = location.origin;
                this.request._description = res.data.item.description || "在这里输入文档描述";
            }).catch(err => {
                this.$errorThrow(err, this);
            }).finally(() => {
                this.loading2 = false;
            });
        },
        //获取host枚举值
        getHostEnum() {
            const params = {
                projectId: this.$route.query.id,
            };
            this.axios.get("/api/project/doc_service", { params }).then(res => {
                this.hostEnum = res.data;
            }).catch(err => {
                console.error(err);
            })
        },
        //接口不存在提醒用户，可能是同时操作的用户删掉了这个接口导致接口不存在
        confirmInvalidDoc() {
            this.$confirm("当前接口不存在，可能已经被删除!", "提示", {
                confirmButtonText: "关闭接口",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$store.commit("apidoc/deleteTabById", {
                    projectId: this.$route.query.id,
                    deleteIds: [this.currentSelectDoc._id]
                });
                if (!this.tabs.find(val => val._id === this.currentSelectDoc._id)) { //关闭左侧后若在tabs里面无法找到选中节点，则取第一个节点为选中节点
                    this.$store.commit("apidoc/changeCurrentTab", {
                        projectId: this.$route.query.id,
                        activeNode: this.tabs[this.tabs.length - 1],
                    });
                }
            }).catch(err => {
                if (err === "cancel" || err === "close") {
                    return;
                }
                this.$errorThrow(err, this);
            });
        },
        generateParams() {
            return {
                id: uuid(),
                key: "", //--------------请求头键
                value: "", //------------请求头值
                type: "string", //-------请求头值类型
                description: "", //------描述
                required: true, //-------是否必填
                children: [], //---------子参数
            };
        },
        //=====================================发送请求====================================//
        //发送请求
        sendRequest() {
            this.loading3 = true;
            this.$refs["response"].sendRequest().then(() => {
                
            }).catch(err => {
                console.error(err);
            }).finally(() => {
                this.loading3 = false;
            });
        },
        //取消请求
        stopRequest() {
            this.loading3 = false;
            this.$refs["response"].stopRequest();
        },
        //=====================================其他操作=====================================//
        //全局变量改变
        handleVariableChange() {
            console.log("change")
            this.request._variableChange = !this.request._variableChange;
        },
    }
};
</script>



<style lang="scss">
.view-content {
    padding: size(10) size(0) size(10) size(20);
    .request {
        .view-title {
            padding: size(5) size(10);
            height: size(38);
            border: 1px dashed $gray-500;
        }
        .el-radio {
            margin-right: size(10);
        }
    }
    .params-wrap {
        height: calc(100vh - 280px);
        overflow-y: auto;
    }
}
</style>
