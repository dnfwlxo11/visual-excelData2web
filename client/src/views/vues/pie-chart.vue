<template>
    <div class="pie">
        <div v-if="useColumn.length">
            <div class="card mb-5 p-3" :ref="`chart-pie`"></div>
        </div>
    </div>
</template>

<script>
import { EventBus } from "../../components/EventBus"

export default {
    name: 'pie',
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
                series: [],
                chart: {
                    type: 'pie',
                    height: 350
                },
                labels: [],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'top',
                            offsetX: 0,
                            offsetY: 0
                        },
                        chart: {
                            width: 200
                        }
                    }
                }],
                legend: {
                    position: 'top',
                    offsetX: 0,
                    offestY: 50
                }
            }

            
            this.excelData.forEach((item) => {
                if (item[this.useColumn] != undefined) {
                    if (!options['labels'].includes(item[this.useColumn])) {
                        options['labels'].push(item[this.useColumn])
                        options['series'].push(0)
                    }

                    options['series'][options['labels'].indexOf(item[this.useColumn])] += 1
                }
            })

            options.title = { "text": `${this.useColumn} 데이터 분포 파이차트` }
            console.log(options)

            return options
        },

        renderChart() {
            const options = this.setOptions()
            this.destroyChart()
        
            
            if (options.series.length > 30) {
                this.chart.push(null)
                this.$refs[`chart-pie`][0].innerHTML =
                    `<strong>범례가 30개가 넘어 그래프로 표현할 수 없는 데이터입니다.</strong>`
            } else {
                this.chart.push(new ApexCharts(this.$refs[`chart-pie`][0], options))
                this.chart[idx].render()
            }
        },
        
        destroyChart() {
            this.chart.map(item => {
                if (item) item.destroy()
            })
            this.chart = []
        },
    },
    created() {
        EventBus.$on("changeCol_pie", this.renderChart)
    },
    mounted() {
        console.log(this.useColumn)
    },
    computed: {
    }
}
</script>

<style>

</style>