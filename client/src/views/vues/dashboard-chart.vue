<template>
    <div class="home">
        <div class="card p-3">
            <div class="row mb-3" ref="chart-basic">
                <div class="col-md-4 p-3">
                    <div class="row justify-content-md-center mb-3"><strong>전체 개수</strong></div>
                    <div ref="chart-total" class="row chart-total d-block mx-auto"></div>
                </div>
                <div class="col-md-4" ref="chart-col-sum">
                    <div class="row justify-content-md-center mb-3"><strong>컬럼 리스트</strong></div>
                    <div style="height: 250px;overflow: auto;">
                        <ul class="list-group" v-for="(item, idx) of useColumn" :key="idx">
                            <li class="list-group-item">{{item}}</li>
                        </ul>
                    </div>
                </div>
                <!-- <div class="col-md-4" ref="chart-min">
                    <div class="row justify-content-md-center mb-3"><strong>컬럼 리스트</strong></div>
                    <div style="height: 250px;overflow: auto;">
                        <ul class="list-group" v-for="(item, idx) of useColumn" :key="idx">
                            <li class="list-group-item">{{item}}</li>
                        </ul>
                    </div>
                </div> -->
            </div>
            <div class="row" ref="chart-basic">
                <div class="col-12" ref="chart-main"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import { EventBus } from "../../components/EventBus"

    export default {
        name: 'home',
        props: ['standardCol', 'excelData', 'useColumn'],
        data() {
            return {
                // excelData: [],
                // useColumn: [],
                options: [1,2],
                chart: [3,4]
            }
        },
        methods: {
            setMain() {
                const options = {
                    series: [{
                        data: []
                    }],
                    chart: {
                        type: 'bar',
                        height: 350,
                        events: {
                            click(chart, w, e) {
                                // console.log(chart, w, e)
                            }
                        }
                    },
                    responsive: [{
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'top',
                                offsetX: 0,
                                offsetY: 0
                            }
                        }
                    }],
                    xaxis: {
                        categories: []
                    },
                    fill: {
                        opacity: 1
                    },
                    legend: {
                        position: 'top',
                        offsetX: 0,
                        offestY: 50
                    }
                }

                this.useColumn.forEach(col => {
                    this.excelData.forEach((item) => {
                        if (item[col] != undefined) {
                            if (!options["xaxis"]["categories"].includes(col)) {
                                options["xaxis"]["categories"].push(col)
                                options["series"][0]["data"].push(0)
                            }
                        }

                        options["xaxis"]["categories"].map((value, idx) => {
                            if ((value == col) && item[col] != null) options['series'][0]["data"][idx] += 1
                        })
                    })
                })

                options.title = {
                    "text": "데이터 현황"
                }

                return new ApexCharts(this.$refs['chart-main'], options)
            },

            getTotal() {
                let total = 0
                this.excelData.map(item => {
                    if (item[this.standardCol] != undefined || item[this.standardCol]) total+=1
                })

                this.$refs['chart-total'].innerText = `${total}개`
            },

            renderChart() {
                const options = [this.setMain()]
                this.destroyChart()

                options.forEach((item, idx) => {
                    this.chart.push(item)
                    this.chart[idx].render()
                })

                this.$nextTick(() => {
                    this.getTotal()
                })
                
            },

            destroyChart() {
                this.chart.map(item => {
                    if (item) item.destroy()
                })
                this.chart = []
            }
        },
        created() {
            EventBus.$on("changeCol_home", this.renderChart)
        },
        mounted() {
            // console.log(this.useColumn, this.excelData)
        },
        computed: {

        },
        beforeDestroy() {
            this.destroyChart()
        },
        destroyed() {
        }
    }
</script>

<style>
    .chart-total {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        border: 10px solid #008FFB;
        text-align: center;
        color: #5D5C6A;
        font-size: 40px;
        vertical-align: middle;
        padding-top: 60px;
    }
</style>