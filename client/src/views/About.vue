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

                parseCol: {
                    "identifier": "Data No",
                    "birth": "생년월일",
                    "sex": "성별",
                    "date": "검사날짜",
                    "pta_ac_125": "125_2",
                    "pta_ac_250": "250_2",
                    "pta_ac_500": "500_2",
                    "pta_ac_1000": "1K_2",
                    "pta_ac_1500": "1.5K_2",
                    "pta_ac_2000": "2K_2",
                    "pta_ac_3000": "3K_2",
                    "pta_ac_4000": "4K_2",
                    "pta_ac_6000": "6K_2",
                    "pta_ac_8000": "8K_2",
                    "pta_bc_125": "125_3",
                    "pta_bc_250": "250_3",
                    "pta_bc_500": "500_3",
                    "pta_bc_1000": "1K_3",
                    "pta_bc_1500": "1.5K_3",
                    "pta_bc_2000": "2K_3",
                    "pta_bc_3000": "3K_3",
                    "pta_bc_4000": "4K_3",
                    "pta_bc_6000": "6K_3",
                    "pta_bc_8000": "8K_3",
                    "hearing_loss": 0, 
                    "pta_img_src": null,
                    "cause_loss_1": 0, 
                    "cause_loss_2": 0, 
                    "cause_loss_3": 0, 
                    "cause_loss_4": 0, 
                    "cause_loss_5": 0, 
                    "cause_loss_6": 0, 
                    "cause_loss_7": 0, 
                    "cause_loss_8": 0, 
                    "cause_loss_9": 0, 
                    "cause_loss_10": 0, 
                    "cause_loss_11": 0, 
                    "cause_loss_12": 0, 
                    "cause_loss_13": 0, 
                    "cause_loss_14": 0, 
                    "cause_loss_15": 0, 
                    "cause_loss_16": 0, 
                    "cause_loss_17": 0, 
                    "cause_loss_18": 0, 
                    "cause_loss_19": 0, 
                    "cause_loss_priority": null,
                    "text_eardr_1": 0, 
                    "text_eardr_2": 0, 
                    "text_eardr_3": 0, 
                    "text_eardr_4": 0, 
                    "text_eardr_5": 0, 
                    "text_eardr_6": 0, 
                    "text_eardr_7": 0, 
                    "img_eardr": null, 
                    "eardr_img_type": "text", 
                    "text_eardr_priority": null,
                    "srt_level": null,
                    "wrs_level": null,
                    "wrs_score": null
                }
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
                console.log(this.excelData)
                const left_data = this.excelData.reduce((acc, item) => {
                    const convertObj = Object.keys(this.parseCol).reduce((result, value) => {
                        result[value] = item[this.parseCol[value]] != undefined ? item[this.parseCol[value]] : null
                        return result
                    }, {})

                    convertObj["sex"] == '남자' ? convertObj.sex = 0 : convertObj.sex = 1
                    convertObj["srt_level"] = item["좌측 SRT"]
                    convertObj["wrs_level"] = item["좌측 WRS"]
                    convertObj["wrs_score"] = item["좌측 레벨"]
                    convertObj["ear_select"] = 1
                    convertObj["eardr_img_type"] = "text"

                    for (let i=1;i<=19;i++) convertObj[`cause_loss_${i}`] = 0
                    for (let i=1;i<=7;i++) convertObj[`text_eardr_${i}`] = 0

                    convertObj[this.cause_loss[item["좌측 원인1 (필수)"]]] = 1
                    if (item["좌측 원인2 (선택)"]) convertObj[this.cause_loss[item["좌측 원인2 (선택)"]]] = 1
                    if (item["좌측 원인3 (선택)"]) convertObj[this.cause_loss[item["좌측 원인3 (선택)"]]] = 1

                    convertObj[this.text_eardr[item["좌측 고막1 (필수)"]]] = 1
                    if (item["좌측 고막2 (선택)"]) convertObj[this.text_eardr[item["좌측 고막2 (선택)"]]] = 1
                    if (item["좌측 고막3 (선택)"]) convertObj[this.text_eardr[item["좌측 고막3 (선택)"]]] = 1

                    convertObj["cause_loss_priority"] = `${this.cause_loss[item["좌측 원인1 (필수)"]]},${this.cause_loss[item["우측 원인2 (선택)"]]},${this.cause_loss[item["우측 원인3 (선택)"]]}`
                    convertObj["text_eardr_priority"] = `${this.text_eardr[item["좌측 고막1 (필수)"]]},${this.text_eardr[item["우측 고막2 (선택)"]]},${this.text_eardr[item["우측 고막3 (선택)"]]}`

                    acc.push(convertObj)
                    
                    return acc
                }, [])

                const right_data = this.excelData.reduce((acc, item) => {
                    const convertObj = Object.keys(this.parseCol).reduce((result, value) => {
                        result[value] = item[this.parseCol[value]] != undefined ? item[this.parseCol[value]] : null
                        return result
                    }, {})

                    convertObj["sex"] == '남자' ? convertObj.sex = 0 : convertObj.sex = 1
                    convertObj["srt_level"] = item["우측 SRT"]
                    convertObj["wrs_level"] = item["우측 WRS"]
                    convertObj["wrs_score"] = item["우측 레벨"]
                    convertObj["ear_select"] = 0
                    convertObj["eardr_img_type"] = "text"

                    for (let i=1;i<=19;i++) convertObj[`cause_loss_${i}`] = 0
                    for (let i=1;i<=7;i++) convertObj[`text_eardr_${i}`] = 0

                    convertObj[this.cause_loss[item["우측 원인1 (필수)"]]] = 1
                    if (item["우측 원인2 (선택)"]) convertObj[this.cause_loss[item["우측 원인2 (선택)"]]] = 1
                    if (item["우측 원인3 (선택)"]) convertObj[this.cause_loss[item["우측 원인3 (선택)"]]] = 1

                    convertObj[this.text_eardr[item["우측 고막1 (필수)"]]] = 1
                    if (item["우측 고막2 (선택)"]) convertObj[this.text_eardr[item["우측 고막2 (선택)"]]] = 1
                    if (item["우측 고막3 (선택)"]) convertObj[this.text_eardr[item["우측 고막3 (선택)"]]] = 1

                    convertObj["cause_loss_priority"] = `${this.cause_loss[item["우측 원인1 (필수)"]]},${this.cause_loss[item["우측 원인2 (선택)"]]},${this.cause_loss[item["우측 원인3 (선택)"]]}`
                    convertObj["text_eardr_priority"] = `${this.text_eardr[item["우측 고막1 (필수)"]]},${this.text_eardr[item["우측 고막2 (선택)"]]},${this.text_eardr[item["우측 고막3 (선택)"]]}`

                    acc.push(convertObj)
                    
                    return acc
                }, [])

                // const left_data = this.excelData.reduce((acc, item) => {
                    
                //     return acc
                // }, [])

                const combineData = right_data.concat(left_data)

                const wb = XLSX.utils.book_new()
                const xlsx = XLSX.utils.json_to_sheet(combineData)
                XLSX.utils.book_append_sheet(wb, xlsx, 'sheet')
                XLSX.writeFile(wb, `exports.xlsx`)

                // if (this.excelData.length) {
                //     this.excelData = this.originalData
                //     this.keyName = Object.keys(this.originalData[0])
                //     console.log(this.keyName)
                // }
            }
        }
    }
</script>