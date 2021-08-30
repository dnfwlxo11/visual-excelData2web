<template>
    <div class="tree">
        <div v-show="useColumn.length">
            <div class="card mb-5 p-3" ref="chart-tree"></div>
        </div>
    </div>
</template>

<script>
import { EventBus } from "../../components/EventBus"

export default {
    name: 'tree',
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
                    type: 'treemap',
                    height: 350
                },
                labels: [],
                legend: {
                    show: false
                }
            }

            
            this.excelData.forEach((item) => {
                if (item[this.useColumn] != undefined) {
                    if (!options['series'][0]['data'].map(option => option['x']).includes(item[this.useColumn])) {
                        options['series'][0]['data'].push({
                            x: item[this.useColumn],
                            y: 0
                        })
                    }

                    if (options['series'][0]['data'].map(option => option['x']).indexOf(item[this.useColumn]) != -1)
                        options['series'][0]['data'][options['series'][0]['data'].map(option => option['x']).indexOf(item[this.useColumn])]['y'] += 1
                }
            })

            options.title = { "text": `${this.useColumn} 데이터 분포 트리맵 차트` }

            return options
        },

        async renderChart() {
            const options = this.setOptions()
            this.destroyChart()
            
            if (options.series[0]['data'].length > 30) {
                this.chart.push(null)
                this.$refs[`chart-tree`].innerHTML =
                    `<strong>범례가 30개가 넘어 그래프로 표현할 수 없는 데이터입니다.</strong>`
            } else {
                this.chart.push(new ApexCharts(this.$refs['chart-tree'], options))
                this.chart[0].render()
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
        EventBus.$on("changeCol_tree", this.renderChart)
    },
    mounted() {
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

</style>