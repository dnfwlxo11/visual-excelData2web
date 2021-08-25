<template>
    <div class="home">
        <div v-if="!excelData.length" class="mb-3">
            <input type="file" @change="fileUpload" entype="multipart/form-data">
        </div>
        <div v-else>
            <button class="btn btn-primary mb-3" @click="initData">초기화</button>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-2" style="height: inherit;overflow: auto">
                    <div>
                        <strong>컬럼 목록</strong>
                    </div>
                    <draggable class="list-group" :list="keyName" group="chart" @change="log">
                        <div class="list-group-item mb-2" v-for="(item, idx) of keyName" :key="idx">
                            {{ item }}
                        </div>
                    </draggable>
                </div>
                <div class="col-2">
                    <div>
                        <strong>사용 컬럼</strong>
                    </div>
                    <draggable class="list-group" :list="useColumn" group="chart" @change="log">
                        <div class="list-group-item mb-2" v-for="(item, idx) of useColumn" :key="idx">
                            {{ item }}
                        </div>
                    </draggable>
                </div>
                <div class="col-2">
                    <div class="mb-3">
                        <button class="btn btn-warning" @click="renderChart">새로고침</button>
                    </div>
                    <div>
                        <button class="btn btn-danger" @click="destroyChart">지우기</button>
                    </div>
                </div>
                <div class="col-6">
                    <div class="btn-group btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-outline-primary mr-1" :class="{'active': chartType == 'basic'}">
                            <input type="radio" name="options" value="basic" @click="setChartType"> 기본
                        </label>
                        <label class="btn btn-outline-primary mr-1" :class="{'active': chartType == 'pie'}">
                            <input type="radio" name="options" value="pie" @click="setChartType"> 파이 차트
                        </label>
                        <label class="btn btn-outline-primary" :class="{'active': chartType == 'multi'}">
                            <input type="radio" name="options" value="multi" @click="setChartType"> 멀티 차트
                        </label>
                    </div>
                    <div ref="chart" class="mb-6">

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
                chart: [],
                chartType: "basic",
                controlOnStart: true,
            }
        },

        created() {

        },

        mounted() {
            this.excelData = this.$store.state.excelData
            this.useColumn = this.$store.state.useColumn
            this.keyName = this.$store.state.keyName
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
                    this.chart.push(new ApexCharts(this.$refs.chart, options))
                    this.chart[0].render()
                } else {
                    options.forEach((item, idx) => {
                        this.chart.push(new ApexCharts(this.$refs.chart, item))
                        this.chart[idx].render()
                    })
                }
            },

            destroyChart() {
                this.chart.map(item => item.destroy())
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
                                position: 'bottom',
                            }
                        }
                    }],
                }

                if (this.chartType == "basic") {
                    optionBase.series = [{ data: [] }]

                    optionBase.chart = {
                        type: 'bar',
                        height: 350,
                        stacked: true,
                        stackType: '100%'
                    }

                    optionBase.responsive[0].options.legend = {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }

                    optionBase.xaxis = { categories: [] }
                    optionBase.fill = { opacity: 1 }
                    optionBase.legend = {
                        position: 'right',
                        offsetX: 0,
                        offsetY: 50
                    }
                } else {
                    this.useColumn.map(() => {
                        const option = JSON.parse(JSON.stringify(optionBase))

                        if (this.chartType == "pie") {
                            option.chart = {
                                width: 380,
                                type: 'pie'
                            }

                            option.labels = []
                            option.responsive[0].options.chart = { "width": 200 }

                            options.push(option)
                        } else if (this.chartType == "multi") {

                        }
                    })
                }

                this.useColumn.forEach((col, idx) => {
                    this.excelData.forEach((item) => {
                        if (this.chartType == "basic") {
                            if (!optionBase["xaxis"]["categories"].includes(col)) {
                                optionBase["xaxis"]["categories"].push(col)
                                optionBase["series"][0]["data"].push(0)
                            }

                            optionBase["xaxis"]["categories"].map((value, seriesIdx) => {
                                if (value == col) {
                                    optionBase['series'][0]["data"][seriesIdx] += 1
                                }
                            })
                        } else if (this.chartType == "pie") {
                            if (!options[idx]['labels'].includes(item[col])) {
                                options[idx]['labels'].push(item[col])
                                options[idx]['series'].push(0)
                            }

                            options[idx]['series'][options[idx]['labels'].indexOf(item[col])] += 1
                        } else if (this.chartType == "multi") {

                        }
                    })
                })

                return this.chartType == "basic" ? optionBase : options
            },

            setChartType(e) {
                this.chartType = e.target.value
                this.renderChart()
            },

            log(item) {
                this.$store.commit('setExcelData', this.excelData)
                this.$store.commit('setUseColumn', this.useColumn)

                this.renderChart()

                return item
            }
        }
    }
</script>

<style>
    ul {
        list-style: none;
    }
</style>