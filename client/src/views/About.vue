<template>
    <div class="about">
        <div class="container mt-3 mb-3">
            <div class="mb-3">
                <input type="file" @change="fileUpload" entype="multipart/form-data">
                <button class="btn btn-secondary" @click="uploadExcel">업로드</button>
            </div>
            <div v-if="excelData" class="text-left">
                <small>데이터 개수 : {{ excelData.length }}</small>
            </div>
            <div v-if="excelData" class="row" style="max-width:inherit;max-height:500px;overflow: auto;white-space:nowrap;">
                <table class="table">
                    <thead>
                        <th v-for="(item, idx) of keyName" :key="idx">
                            {{item}}
                        </th>
                    </thead>
                    <tr v-for="(item, idx) in excelData" :key="idx">
                        <th v-for="(key, idx) of keyName" :key="idx">
                            <span v-if="item[key]==null">-</span>
                            <span v-else>{{ item[key] }}</span>
                        </th>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import EventBus from '@/EventBus'
    import axios from 'axios'

    import XLSX from 'xlsx'

    export default {
        name: 'About',

        data() {
            return {
                file: null,
                fileName: null,
                excelData: [],
                keyName: []
            }
        },

        created() {
            EventBus.$emit("excelData")

            EventBus.$on("excelData", (data) => {
                console.log('데이터 받음')
                this.excelData = data
            })
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

            fileUpload(e) {
                this.file = e.target.files[0]

                const reader = new FileReader()

                reader.onload = (e) => {
                    const data = reader.result
                    const excelData = XLSX.read(data, {
                        type: 'binary'
                    })

                    this.excelData = XLSX.utils.sheet_to_json(excelData.Sheets['sheet'])
                    this.keyName = Object.keys(this.excelData[0])
                }

                reader.readAsBinaryString(this.file)
            },
        }
    }
</script>