import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        excelData: [],
        keyName: []
    },

    getters: {
        getExcelData: (state) => {
            return state.excelData
        },

        getKeyName: (state) => {
            return state.keyName
        }
    },

    mutations: {
        setExcelData: (state, payload) => {
            return state.excelData = payload
        },

        setKeyName: (state, payload) => {
            return state.keyName = payload
        }
    }
})