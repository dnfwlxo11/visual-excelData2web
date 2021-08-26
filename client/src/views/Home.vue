<template>
    <div class="home">
        <div v-if="!excelData.length" class="mb-3">
            <input type="file" @change="fileUpload" entype="multipart/form-data">
        </div>
        <div v-else>
            <button class="btn btn-primary mb-3" @click="initData">초기화</button>
        </div>
        <div class="row p-5">
            <div v-if="getType!='home'" class="col-4">
                <div class="row mb-5">
                    <div class="col-6">
                        <div class="mb-3">
                            <strong>컬럼 목록</strong>
                        </div>
                        <draggable class="list-group" :list="keyName" group="chart" @change="log" style="height: 500px;overflow: auto;border: solid 1px;">
                            <div class="list-group-item mb-2" v-for="(item, idx) of keyName" :key="idx">
                                {{ item }}
                            </div>
                        </draggable>
                    </div>
                    <div class="col-6">
                        <div class="mb-3">
                            <strong>사용 컬럼</strong>
                        </div>
                        <draggable class="list-group" :list="useColumn" group="chart" @change="log" style="height: 500px;overflow: auto;border: solid 1px;">
                            <div class="list-group-item mb-2" v-for="(item, idx) of useColumn" :key="idx">
                                {{ item }}
                            </div>
                        </draggable>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <button class="btn btn-warning mr-3" @click="renderChart">새로고침</button>
                        <button class="btn btn-danger" @click="destroyChart">지우기</button>
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
                    <label class="btn btn-outline-primary mr-1" :class="{'active': chartType == 'home'}">
                        <input type="radio" name="options" value="home" @click="setChartType"> 대쉬보드
                    </label>
                    <label class="btn btn-outline-primary mr-1" :class="{'active': chartType == 'basic'}">
                        <input type="radio" name="options" value="basic" @click="setChartType"> 바차트
                    </label>
                    <label class="btn btn-outline-primary" :class="{'active': chartType == 'pie'}">
                        <input type="radio" name="options" value="pie" @click="setChartType"> 파이차트
                    </label>
                </div>
                <div style="height: 500px;overflow: auto">
                    <div v-if="getType=='basic'&&useColumn.length">
                        <div class="card mb-5 p-3" :ref="`chart-basic`"></div>
                    </div>
                    <div v-else-if="getType=='pie'" v-for="(item, idx) of useColumn" :key="idx">
                        <div class="card mb-5 p-3" :ref="`chart-${idx}`"></div>
                    </div>
                    <div v-else>
                        <div class="card mb-5 p-3" :ref="`chart-dashboard`"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable"

    import XLSX from 'xlsx'

    export default {
        name: 'Home',
        order: 1,

        components: {
            draggable
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
                controlOnStart: true,
                color: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800', '#3fA2E9', '#A2666D', '#E7A546', '#E63E91', '#800FF9']
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

            this.$nextTick(() => {
                this.renderChart()
            })
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
                    console.log(this.keyName, this.originalKey)
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

            renderChart() {
                if (!this.useColumn.length) return

                const options = this.setData()
                this.destroyChart()

                if (this.chartType == "basic") {
                    this.chart.push(new ApexCharts(this.$refs['chart-basic'], options))
                    this.chart[0].render()
                } else if (this.chartType == "pie") {
                    options.forEach((item, idx) => {
                        if (item.series.length > 30) {
                            this.chart.push(null)
                            this.$refs[`chart-${idx}`][0].innerHTML = `<strong>범례가 30개가 넘어 그래프로 표현할 수 없는 데이터입니다.</strong>`
                        } else { 
                            this.chart.push(new ApexCharts(this.$refs[`chart-${idx}`][0], item))
                            this.chart[idx].render()
                        }
                    })
                } else {

                }
            },

            destroyChart() {
                this.chart.map(item => { if (item) item.destroy() })
                this.chart = []
            },

            setData() {
                let options = []

                const optionBase = {
                    series: [],
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'top',
                            }
                        }
                    }]
                }

                if (this.chartType == "basic") {
                    optionBase.series = [{ data: [] }]

                    optionBase.chart = {
                        type: 'bar',
                        height: 350,
                    }

                    optionBase.responsive[0].options.legend = {
                        position: 'top',
                        offsetX: 0,
                        offsetY: 0
                    }

                    optionBase.xaxis = { categories: [] }
                    optionBase.fill = { opacity: 1 }
                    optionBase.legend = {
                        position: 'top',
                        offsetX: 0,
                        offsetY: 50
                    }
                } else if (this.chartType == "home") {
                    
                }

                this.useColumn.forEach((col, idx) => {
                    this.excelData.forEach((item) => {
                        if (this.chartType == "basic" && item[col] != undefined) {
                            if (!optionBase["xaxis"]["categories"].includes(col)) {
                                optionBase["xaxis"]["categories"].push(col)
                                optionBase["series"][0]["data"].push(0)
                            }

                            optionBase["xaxis"]["categories"].map((value, seriesIdx) => {
                                if (value == col) {
                                    optionBase['series'][0]["data"][seriesIdx] += 1
                                }
                            })
                        } else if (this.chartType == "pie" && item[col] != undefined) {
                            if (!options[idx]['labels'].includes(item[col])) {
                                options[idx]['labels'].push(item[col])
                                options[idx]['series'].push(0)
                            }

                            options[idx]['series'][options[idx]['labels'].indexOf(item[col])] += 1
                        } else if (this.chartType == "home") {

                        }
                    })

                    if (this.chartType == "pie") options[idx].title = { "text": `${col} 데이터 분포 파이차트`}
                })

                if (this.chartType == "basic") optionBase.title = { "text": "컬럼별 데이터 개수 표"}

                return this.chartType == "basic" ? optionBase : options
            },

            setChartType(e) {
                this.chartType = e.target.value

                this.$nextTick(() => {
                    this.renderChart()
                })
            },

            setStandard() {
                this.$store.commit('setStandardCol', this.standardCol)
            },

            log(item) {
                this.$store.commit('setExcelData', this.excelData)
                this.$store.commit('setUseColumn', this.useColumn)

                this.renderChart()

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