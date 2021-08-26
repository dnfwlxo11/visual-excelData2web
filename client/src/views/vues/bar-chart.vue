<template>
    <div class="bar">
        <div v-if="useColumn.length">
            <div class="card mb-5 p-3" ref="chart-basic"></div>
        </div>
    </div>
</template>

<script>
import { EventBus } from "../../components/EventBus"

export default {
    name: 'bar',
    props: ['excelData', 'useColumn'],
    data() {
        return {
            // excelData: [],
            // useColumn: [],
            options: [],
            chart: []
        }
    },
    methods: {
        setOptions() {
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
                        if (value == col) options['series'][0]["data"][idx] += 1
                    })
                })
            })

            options.title = { "text": "컬럼별 데이터 개수 표" }

            return options
        },

        renderChart() {
            const options = this.setOptions()
            this.destroyChart()

            this.chart.push(new ApexCharts(this.$refs['chart-basic'], options))
            this.chart[0].render()
        },
        
        destroyChart() {
            this.chart.map(item => {
                if (item) item.destroy()
            })
            this.chart = []
        }
    },
    created() {
        EventBus.$on("changeCol_basic", this.renderChart)
    },
    mounted() {
    },
    computed: {
    }
}
</script>

<style>

</style>