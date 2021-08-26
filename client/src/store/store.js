import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        standardCol: null,
        excelData: [],
        useColumn: [],
        keyName: [],
        originalKey: [],
    },

    getters: {
        getStandardCol: (state) => {
            return state.standardCol
        },

        getExcelData: (state) => {
            return state.excelData
        },

        getUseColumn: (state) => {
            return state.useColumn
        },

        getKeyName: (state) => {
            return state.keyName
        },

        getOriginalKey: (state) => {
            return state.originalKey
        }
    },

    mutations: {
        setStandardCol: (state, payload) => {
            return state.standardCol = payload
        },
        
        setExcelData: (state, payload) => {
            return state.excelData = payload
        },

        setUseColumn: (state, payload) => {
            return state.useColumn = payload
        },

        setKeyName: (state, payload) => {
            return state.keyName = payload
        },

        setOriginalKey: (state, payload) => {
            return state.orig = payload
        }
    }
})