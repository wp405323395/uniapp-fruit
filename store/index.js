import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: true,
        hasLogin: uni.getStorageSync('token'),
        userName: uni.getStorageSync('userName')
    },
    mutations: {
        login(state, userName) {
            state.userName = userName || '新用户';
			uni.setStorageSync('userName',state.userName)
            state.hasLogin = true;
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
        }
    }
})

export default store
