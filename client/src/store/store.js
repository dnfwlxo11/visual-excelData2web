import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        excelData: [],
        useColumn: [],
        keyName: []
    },

    getters: {
        getExcelData: (state) => {
            return state.excelData
        },

        getUseColumn: (state) => {
            return state.useColumn
        },

        getKeyName: (state) => {
            return state.keyName
        }
    },

    mutations: {
        setExcelData: (state, payload) => {
            return state.excelData = payload
        },

        setUseColumn: (state, payload) => {
            return state.useColumn = payload
        },

        setKeyName: (state, payload) => {
            return state.keyName = payload
        }
    }
})