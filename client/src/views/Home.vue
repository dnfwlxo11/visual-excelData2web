<template>
    <div class="home">
        <div v-if="!excelData.length" class="mb-3">
            <input type="file" @change="fileUpload_special" entype="multipart/form-data">
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
                useColumn: [],
                controlOnStart: true,



                // originalCol: ["Data No", "등록번호", "생년월일", "성별", "검사날짜", 
                //               "125", "250", "500", "1K", "1.5K", "2K", "3K", "4K", "6K", 
                //               "125_1", "250_1", "500_1", "1K_1", "1.5K_1", "2K_1", 
                //               "125_2", "250_2", "500_2", "1K_2", "2K_2", "3K_2", "4K_2", "6K_2", "8K_2", 
                //               "125_3", "250_3", "500_3", "1K_3", "1.5K_3", "2K_3", 
                //               "우측 SRT", "좌측 SRT", "우측 레벨", "좌측 레벨", 
                //               "우측 원인1 (필수)", "우측 원인2 (선택)", "우측 원인3 (선택)", 
                //               "좌측 원인1 (필수)", "좌측 원인2 (선택)", "좌측 원인3 (선택)", 
                //               "우측 고막1 (필수)", "우측 고막2 (선택)", "우측 고막3 (선택)", 
                //               "좌측 고막1 (필수)", "좌측 고막2 (선택)", "좌측 고막3 (선택)", 
                //               "우측", "좌측"],

                // exportCol: ["identifier", "birth", "sex", "date", "ear_select", 
                //             "pta_ac_500", "pta_ac_1000", "pta_ac_2000", "pta_ac_4000", 
                //             "pta_bc_500", "pta_bc_1000", "pta_bc_2000", "pta_bc_4000", 
                //             "hearing_loss", "pta_img_src", "cause_loss_1", "cause_loss_2", "cause_loss_3", "cause_loss_4", "cause_loss_5", "cause_loss_6", "cause_loss_7", "cause_loss_8", "cause_loss_9", "cause_loss_10", "cause_loss_11", "cause_loss_12", "cause_loss_13", "cause_loss_14", "cause_loss_15", "cause_loss_16", "cause_loss_17", "cause_loss_18", "cause_loss_19", "cause_loss_priority", 
                //             "text_eardr_1", "text_eardr_2", "text_eardr_3", "text_eardr_4", "text_eardr_5", "text_eardr_6", "text_eardr_7", 
                //             "img_eardr", "eardr_img_type", "text_eardr_priority"],
                
                
            }
        },

        created() {
            
        },

        mounted() {
            this.excelData = this.$store.state.excelData
            this.useColumn = this.$store.state.UseColumn
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

            fileUpload_special(e) {
                this.file = e.target.files[0]

                const reader = new FileReader()

                reader.onload = (e) => {
                    const data = reader.result
                    const excelData = XLSX.read(data, {
                        type: 'binary'
                    })
                    
                    const sheetName = Object.keys(excelData.Sheets)[0]
                    const excel = excelData.Sheets[sheetName]

                    excel["!ref"] = "A2:" + excel["!ref"].split(':')[1]
                    
                    this.$store.commit('setExcelData', XLSX.utils.sheet_to_json(excel))
                    this.excelData = this.$store.getters.getExcelData

                    this.$store.commit('setKeyName', Object.keys(this.excelData[0]))
                    this.keyName = this.$store.getters.getKeyName
                    console.log(this.keyName)
                }

                reader.readAsBinaryString(this.file)
            },

            initData() {
                this.file = null

                this.$store.commit('setExcelData', [])
                this.excelData = this.$store.getters.getExcelData

                this.$store.commit('setUseColumn', [])
                this.excelData = this.$store.getters.getUseColumn

                this.$store.commit('setKeyName', [])
                this.keyName = this.$store.getters.getKeyName
            },

            log(item) {
                this.$store.commit('setUseColumn', this.keyName)
                this.$store.commit('setUseColumn', this.useColumn)
                console.log(this.keyName, this.useColumn)
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