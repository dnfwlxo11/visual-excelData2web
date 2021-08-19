<template>
    <div class="about">
        <div class="container mt-3 mb-3">
            <div v-if="excelData" class="text-left mb-3">
                <small class="mr-3">데이터 개수 : {{ excelData.length }}</small>
                <button class="btn btn-secondary" @click="setOriginal">원래대로</button>
            </div>
            <div v-if="excelData" class="row" style="max-width:inherit;max-height:500px;overflow: auto;white-space:nowrap;">
                <table class="table">
                    <thead>
                        <draggable v-model="keyName" tag="tr">
                            <th v-for="(item, idx) of keyName" :key="idx">
                                {{ item }}
                            </th>
                        </draggable>
                    </thead>
                    <draggable v-model="excelData" tag="tbody">
                        <tr v-for="(item, idx) in excelData" :key="idx">
                            <td v-for="(key, idx) of keyName" :key="idx">
                                <span v-if="item[key]==null">-</span>
                                <span v-else>{{ item[key] }}</span>
                            </td>
                        </tr>
                    </draggable>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import draggable from "vuedraggable"
    import XLSX from 'xlsx'

    export default {
        name: 'About',
        display: "Table",

        components: {
            draggable
        },

        data() {
            return {
                file: null,
                fileName: null,
                originalData: [],
                excelData: [],
                keyName: [],

                excelCol: ["Data No", "등록번호", "생년월일", "성별", "검사날짜", 
                           "125", "250", "500", "1K", "1.5K", "2K", "3K", "4K", "6K", "8K",
                           "125_1", "250_1", "500_1", "1K_1", "1.5K_1", "2K_1", "3K_1", "4K_1", "6K_1", "8K_1",
                           "125_2", "250_2", "500_2", "1K_2", "1.5K_2","2K_2", "3K_2", "4K_2", "6K_2", "8K_2", 
                           "125_3", "250_3", "500_3", "1K_3", "1.5K_3", "2K_3", "3K_3", "4K_3", "6K_3", "8K_3",
                           "우측 SRT", "좌측 SRT", "우측 WRS", "우측 레벨", "좌측 WRS", "좌측 레벨", 
                           "우측 원인1 (필수)", "우측 원인2 (선택)", "우측 원인3 (선택)", 
                           "좌측 원인1 (필수)", "좌측 원인2 (선택)", "좌측 원인3 (선택)", 
                           "우측 고막1 (필수)", "우측 고막2 (선택)", "우측 고막3 (선택)", 
                           "좌측 고막1 (필수)", "좌측 고막2 (선택)", "좌측 고막3 (선택)", 
                           "우측", "좌측"],

                text_eardr: {
                    "정상": "text_eardr_1", 
                    "천공": "text_eardr_2", 
                    "염증": "text_eardr_3", 
                    "함입 및 유착": "text_eardr_4", 
                    "종물": "text_eardr_5", 
                    "삼출액": "text_eardr_6", 
                    "술후 상태": "text_eardr_7", 
                },

                cause_loss: {
                    "정상": "cause_loss_1",
                    "유전성/선천성": "cause_loss_2",
                    "소음성": "cause_loss_3",
                    "두부외상": "cause_loss_4",
                    "노인성": "cause_loss_5",
                    "메니에르병": "cause_loss_6",
                    "돌발성난청": "cause_loss_7",
                    "후미로성": "cause_loss_8",
                    "외이도감염": "cause_loss_9",
                    "외이 종물": "cause_loss_10",
                    "선천성(외이도폐쇄/소이증)": "cause_loss_11",
                    "외상성 고막천공": "cause_loss_12",
                    "선천성 이소골 기형": "cause_loss_13",
                    "삼출성/급성 중이염": "cause_loss_14",
                    "만성중이염": "cause_loss_15",
                    "진주종성중이염": "cause_loss_16",
                    "이경화증": "cause_loss_17",
                    "종양(Glomus/선천성진주종)": "cause_loss_18",
                    "원인미상": "cause_loss_19"
                },

                parseCol: [
                    "identifier",
                    "birth",
                    "sex",
                    "date",
                    "pta_ac_125",
                    "pta_ac_250",
                    "pta_ac_500",
                    "pta_ac_1000",
                    "pta_ac_1500",
                    "pta_ac_2000",
                    "pta_ac_3000",
                    "pta_ac_4000",
                    "pta_ac_6000",
                    "pta_ac_8000",
                    "pta_bc_125",
                    "pta_bc_250",
                    "pta_bc_500",
                    "pta_bc_1000",
                    "pta_bc_1500",
                    "pta_bc_2000",
                    "pta_bc_3000",
                    "pta_bc_4000",
                    "pta_bc_6000",
                    "pta_bc_8000",
                    "srt_level",
                    "wrs_level",
                    "wrs_score"
                ]
            }
        },

        created() {

        },

        mounted() {
            this.originalData = this.$store.getters.getExcelData
            this.excelData = this.$store.getters.getExcelData
            this.keyName = this.excelData.length ? Object.keys(this.excelData[0]) : ['데이터 없음']
        },

        methods: {
            async uploadExcel() {
                if (!this.file) {
                    alert('파일이 없습니다.')
                    return false
                }

                let res = await axios.post('/file/upload', {
                    fileName: this.fileName
                })

                console.log(res.data)
            },

            setOriginal() {
                const exportData = this.excelData.reduce((acc, item) => {
                    if (item["등록번호"]) {
                        console.log(item["등록번호"])
                        const baseCol = this.excelCol
                        const rightCol = baseCol.slice(1, 25).concat(baseCol.slice(45, 46)).concat(baseCol.slice(47, 49))
                        const rightCause = baseCol.slice(51, 54).map(arr => { if (item[arr]) return this.cause_loss[item[arr]] }).filter(arr => { if (arr != undefined) return arr })
                        const rightEar = baseCol.slice(57, 60).map(arr => { if (item[arr]) return this.text_eardr[item[arr]] }).filter(arr => { if (arr != undefined) return arr })
                        const leftCol = baseCol.slice(1, 5).concat(baseCol.slice(25, 45)).concat(baseCol.slice(46, 47)).concat(baseCol.slice(49, 51))
                        const leftCause = baseCol.slice(54, 57).map(arr => { if (item[arr]) return this.cause_loss[item[arr]] }).filter(arr => { if (arr != undefined) return arr })
                        const leftEar = baseCol.slice(60, 63).map(arr => { if (item[arr]) return this.text_eardr[item[arr]] }).filter(arr => { if (arr != undefined) return arr })

                        let cnt = 0
                        const rightData = rightCol.reduce((right, value) => {
                            right[this.parseCol[cnt]] = item[value]
                            cnt += 1
                            return right
                        }, {})

                        cnt = 0
                        const leftData = leftCol.reduce((left, value) => {
                            left[this.parseCol[cnt]] = item[value]
                            cnt += 1
                            return left
                        }, {})

                        for (let i=1;i<=19;i++) rightData[`cause_loss_${i}`] = 0
                        for (let i=1;i<=7;i++) rightData[`text_eardr_${i}`] = 0
                        for (let i=1;i<=19;i++) leftData[`cause_loss_${i}`] = 0
                        for (let i=1;i<=7;i++) leftData[`text_eardr_${i}`] = 0

                        rightData["cause_loss_priority"] = ""
                        rightData["cause_loss_priority"] += rightCause.map(item => { if(item != undefined) return `${item}` })
                        leftData["cause_loss_priority"] = ""
                        leftData["cause_loss_priority"] += leftCause.map(item => { if(item != undefined) return `${item}` })
                        rightData["text_eardr_priority"] = ""
                        rightData["text_eardr_priority"] += rightEar.map(item => { if(item != undefined) return `${item}` })
                        leftData["text_eardr_priority"] = ""
                        leftData["text_eardr_priority"] += leftEar.map(item => { if(item != undefined) return `${item}` })

                        for (let i=0;i<rightCause.length;i++) rightData[rightCause[i]] = 1
                        for (let i=0;i<rightEar.length;i++) rightData[rightEar[i]] = 1
                        for (let i=0;i<leftCause.length;i++) rightData[leftCause[i]] = 1
                        for (let i=0;i<leftEar.length;i++) rightData[leftEar[i]] = 1

                        
                        acc.push(rightData)
                        acc.push(leftData)

                        // console.log(rightData, leftData)    
                    }

                    return acc
                }, [])

                const wb = XLSX.utils.book_new()
                const xlsx = XLSX.utils.json_to_sheet(exportData)
                XLSX.utils.book_append_sheet(wb, xlsx, 'sheet')
                XLSX.writeFile(wb, `exports.xlsx`)

                // 원래 프로젝트 코드
                // if (this.excelData.length) {
                //     this.excelData = this.originalData
                //     this.keyName = Object.keys(this.originalData[0])
                //     console.log(this.keyName)
                // }
            }
        }
    }
</script>