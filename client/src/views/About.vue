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
    import axios from "axios"
    import draggable from "vuedraggable"
    import XLSX from "xlsx"
    import dummy from "@/dummy"

    export default {
        name: "About",
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

                excelCol: dummy.excelCol,
                text_eardr: dummy.text_eardr,
                cause_loss: dummy.cause_loss,
                parseCol: dummy.parseCol
            }
        },

        created() {

        },

        mounted() {
            this.originalData = this.$store.getters.getExcelData
            this.excelData = this.$store.getters.getExcelData
            this.keyName = this.excelData.length ? Object.keys(this.excelData[0]) : ["데이터 없음"]
        },

        methods: {
            async uploadExcel() {
                if (!this.file) {
                    alert("파일이 없습니다.")
                    return false
                }

                let res = await axios.post("/file/upload", {
                    fileName: this.fileName
                })

                console.log(res.data)
            },

            setOriginal() {
                const exportData = this.excelData.reduce((acc, item) => {
                    if (item["등록번호"]) {
                        const baseCol = this.excelCol
                        const variableCol = [0, null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "", 0, 0, 0, 0, 0, 0, 0, null, "text", ""]
                        const rightCol = baseCol.slice(1, 26).concat(variableCol).concat(baseCol.slice(46, 47)).concat(baseCol.slice(48, 50))
                        const rightCause = baseCol.slice(52, 55).map(arr => { if (item[arr]) return this.cause_loss[item[arr]] }).filter(arr => { return arr != undefined })
                        const rightEar = baseCol.slice(58, 61).map(arr => { if (item[arr]) return this.text_eardr[item[arr]] }).filter(arr => { return arr != undefined })
                        const leftCol = baseCol.slice(1, 6).concat(baseCol.slice(26, 46)).concat(variableCol).concat(baseCol.slice(47, 48)).concat(baseCol.slice(50, 52))
                        const leftCause = baseCol.slice(55, 58).map(arr => { if (item[arr]) return this.cause_loss[item[arr]] }).filter(arr => { return arr != undefined })
                        const leftEar = baseCol.slice(61, 64).map(arr => { if (item[arr]) return this.text_eardr[item[arr]] }).filter(arr => { return arr != undefined })

                        let cnt = 0
                        const rightData = rightCol.reduce((right, value) => {
                            if (cnt > 24 && cnt < 57) right[this.parseCol[cnt]] = value
                            else right[this.parseCol[cnt]] = item[value]
                            cnt += 1
                            return right
                        }, {})

                        cnt = 0
                        const leftData = leftCol.reduce((left, value) => {
                            if (cnt > 24 && cnt < 57) left[this.parseCol[cnt]] = value
                            else left[this.parseCol[cnt]] = item[value]
                            cnt += 1
                            return left
                        }, {})

                        for (let i=0;i<rightCause.length;i++) rightData[rightCause[i]] = 1
                        rightData["cause_loss_priority"] += rightCause.join(",")
                        for (let i=0;i<rightEar.length;i++) rightData[rightEar[i]] = 1
                        rightData["text_eardr_priority"] += rightEar.join(",")
                        for (let i=0;i<leftCause.length;i++) leftData[leftCause[i]] = 1
                        leftData["cause_loss_priority"] += leftCause.join(",")
                        for (let i=0;i<leftEar.length;i++) leftData[leftEar[i]] = 1
                        leftData["text_eardr_priority"] += leftEar.join(",")

                        rightData["ear_select"] = 0
                        leftData["ear_select"] = 1
                        rightData["sex"] == "남" ? rightData["sex"] = 0 : rightData["sex"] = 1
                        leftData["sex"] == "남" ? leftData["sex"] = 0 : leftData["sex"] = 1

                        acc.push(rightData)
                        acc.push(leftData)
                    }

                    return acc
                }, [])

                const wb = XLSX.utils.book_new()
                const xlsx = XLSX.utils.json_to_sheet(exportData)
                XLSX.utils.book_append_sheet(wb, xlsx, "sheet")
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