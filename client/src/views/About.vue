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
                keyName: []
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
                if (this.excelData.length) {
                    this.excelData = this.originalData
                    this.keyName = Object.keys(this.originalData[0])
                    console.log(this.keyName)
                }
            }
        }
    }
</script>
