import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        excelData: []
    },

    getters: {
        getExcelData: (state) => {
            return state.excelData
        }
    },

    mutations: {
        setExcelData: (state, payload) => {
            return state.excelData = payload
        }
    }
})