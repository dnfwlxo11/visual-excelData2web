<template>
    <div class="home">
        <div v-if="!excelData.length" class="mb-3">
            <input type="file" @change="fileUpload" entype="multipart/form-data">
        </div>
        <div v-else>
            <div class="row justify-content-md-center">
                <button class="btn btn-primary mb-3" @click="initData">초기화</button>
            </div>
            <div class="row justify-content-md-center p-5">
                <div v-if="getType!='home'" class="col-4">
                    <div class="row mb-5">
                        <div class="col-6">
                            <div class="mb-3">
                                <strong>컬럼 목록</strong>
                            </div>
                            <draggable class="list-group" :list="keyName" group="chart" @change="log"
                                style="height: 500px;overflow: auto;border: solid 1px;">
                                <div class="list-group-item mb-2" v-for="(item, idx) of keyName" :key="idx">
                                    {{ item }}
                                </div>
                            </draggable>
                        </div>
                        <div class="col-6">
                            <div class="mb-3">
                                <strong>사용 컬럼</strong>
                            </div>
                            <draggable class="list-group" :list="useColumn" group="chart" @change="log"
                                style="height: 500px;overflow: auto;border: solid 1px;">
                                <div class="list-group-item mb-2" v-for="(item, idx) of useColumn" :key="idx">
                                    {{ item }}
                                </div>
                            </draggable>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <button class="btn btn-warning mr-3" @click="EventBus.$emit(`changeCol_${getType}`)">새로고침</button>
                            <button class="btn btn-danger">지우기</button>
                        </div>
                    </div>
                </div>
                <div v-else class="col-2">
                    <div class="form-group">
                        <label for="exampleFormControlSelect1">기준(번호) 컬럼명</label>
                        <select class="form-control" v-model="standardCol" @change="setStandard">
                            <option v-for="(item, idx) of originalKey" :key="idx" :value="item">{{ item }}</option>
                        </select>
                    </div>
                </div>
                <div class="col-8">
                    <div class="btn-group btn-group-toggle mb-5" data-toggle="buttons">
                        <label class="btn btn-outline-primary mr-1" :class="{'active': getType == 'home'}">
                            <input type="radio" name="options" value="home" @click="setChartType"> 대쉬보드
                        </label>
                        <label class="btn btn-outline-primary mr-1" :class="{'active': getType == 'basic'}">
                            <input type="radio" name="options" value="basic" @click="setChartType"> 바차트
                        </label>
                        <label class="btn btn-outline-primary" :class="{'active': getType == 'pie'}">
                            <input type="radio" name="options" value="pie" @click="setChartType"> 파이차트
                        </label>
                    </div>
                    <div style="height: 700px;overflow: auto">
                        <bar v-if="getType=='basic'" :useColumn="useColumn" :excelData="excelData"></bar>
                        <div v-else-if="getType=='pie'" v-for="(item, idx) of useColumn" :key="idx">
                            <pie :useColumn="item" :excelData="excelData"></pie>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable"
    import bar from "./vues/bar-chart.vue"
    import pie from "./vues/pie-chart.vue"
    import { EventBus } from "../components/EventBus"

    import XLSX from 'xlsx'

    export default {
        name: 'Home',
        order: 1,

        components: {
            draggable,
            bar,
            pie
        },

        data() {
            return {
                file: null,
                fileName: null,
                excelData: [],
                keyName: [],
                useColumn: [],
                originalKey: [],
                standardCol: null,
                chart: [],
                chartType: "home",
                controlOnStart: true
            }
        },

        created() {

        },

        mounted() {
            this.excelData = this.$store.state.excelData
            this.useColumn = this.$store.state.useColumn
            this.keyName = this.$store.state.keyName
            this.originalKey = this.$store.state.originalKey
            this.standardCol = this.$store.state.standardCol
        },

        methods: {
            fileUpload(e) {
                this.file = e.target.files[0]

                const reader = new FileReader()

                reader.onload = (e) => {
                    const data = reader.result
                    const excelData = XLSX.read(data, {
                        type: 'binary'
                    })

                    const sheetName = Object.keys(excelData.Sheets)[0]
                    const excel = XLSX.utils.sheet_to_json(excelData.Sheets[sheetName])

                    this.$store.commit('setExcelData', excel)
                    this.excelData = this.$store.getters.getExcelData

                    this.$store.commit('setKeyName', Object.keys(this.excelData[0]))
                    this.keyName = this.$store.getters.getKeyName

                    this.$store.commit('setOriginalKey', Object.keys(this.excelData[0]))
                    this.originalKey = this.$store.getters.getOriginalKey
                    this.standardCol = this.originalKey[0]
                }

                reader.readAsBinaryString(this.file)
            },

            initData() {
                this.file = null
                this.chart.map(item => item.destroy())
                this.chart = []

                this.$store.commit('setExcelData', [])
                this.excelData = this.$store.getters.getExcelData

                this.$store.commit('setUseColumn', [])
                this.useColumn = this.$store.getters.getuseColumn

                this.$store.commit('setKeyName', [])
                this.keyName = this.$store.getters.getKeyName
            },

            setChartType(e) {
                this.chartType = e.target.value

                EventBus.$emit(`changeCol_${this.getType}`)
                // this.$nextTick(() => {
                //     EventBus.$emit(`changeCol_${this.getType}`)
                // })
            },

            setStandard() {
                this.$store.commit('setStandardCol', this.standardCol)
            },

            log(item) {
                this.$store.commit('setExcelData', this.excelData)
                this.$store.commit('setUseColumn', this.useColumn)

                EventBus.$emit(`changeCol_${this.getType}`)
                this.$nextTick(() => {
                    EventBus.$emit(`changeCol_${this.getType}`)
                })

                return item
            }
        },

        computed: {
            getUseColumn() {
                return this.useColumn
            },

            getType() {
                return this.chartType
            }
        }
    }
</script>

<style>
    ul {
        list-style: none;
    }
</style>