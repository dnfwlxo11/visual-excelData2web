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
                <div class="col-2">
                    <div>
                        <strong>컬럼 목록</strong>
                    </div>
                    <draggable class="dragArea list-group" :list="keyName" :clone="clone" :group="{ name: 'original', pull: pullFunction }" @start="start">
                        <div class="list-group-item mb-2" v-for="(item, idx) of keyName" :key="idx">
                            {{ item }}
                        </div>
                    </draggable>
                </div>
                <div class="col-2">
                    <div>
                        <strong>사용 컬럼</strong>
                    </div>
                    <draggable class="dragArea list-group" :list="chartData" group="chart">
                        <div class="list-group-item mb-2" v-for="(item, idx) of chartData" :key="idx">
                        {{ item }}
                        </div>
                    </draggable>
                </div>
                <div class="col-8">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    // import axios from 'axios'

    import XLSX from 'xlsx'

    export default {
        name: 'Home',
        display: "Clone on Control",

        components: {
            draggable
        },

        data() {
            return {
                file: null,
                fileName: null,
                excelData: [],
                keyName: [],
                chartData: [],
                controlOnStart: true,
                idGlobal: 0
            }
        },

        created() {
            
        },

        mounted() {
            this.excelData = this.$store.state.excelData
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

                    
                    this.$store.commit('setExcelData', XLSX.utils.sheet_to_json(excelData.Sheets[sheetName]))
                    this.excelData = this.$store.getters.getExcelData

                    this.$store.commit('setKeyName', Object.keys(this.excelData[0]))
                    this.keyName = this.$store.getters.getKeyName
                }

                reader.readAsBinaryString(this.file)
            },

            initData() {
                this.file = null

                this.$store.commit('setExcelData', [])
                this.excelData = this.$store.getters.getExcelData

                this.$store.commit('setKeyName', [])
                this.keyName = this.$store.getters.getKeyName
            },

            clone(item) {
                console.log(item)
                return item;
            },
            
            pullFunction() {
                return this.controlOnStart ? "clone" : true;
            },

            start({ originalEvent }) {
                this.controlOnStart = originalEvent.ctrlKey;
            }
        }
    }
</script>

<style>
    ul {
        list-style: none;
    }
</style>