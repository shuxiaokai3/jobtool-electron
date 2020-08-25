import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules"
Vue.use(Vuex);

const store = new Vuex.Store({
    modules,
    // plugins: process.env.IS_WEB ? [] : [
    //     window.require("vuex-electron").createPersistedState(),
    //     window.require("vuex-electron").createSharedMutations()
    // ],
    strict: false,
});



export default store;
