<template>
    <div class="home">
        <div v-if="!excelData.length" class="mb-3">
            <input type="file" @change="fileUpload" entype="multipart/form-data">
            <button class="btn btn-secondary" @click="uploadExcel">업로드</button>
        </div>
        <div v-else>
            <button class="btn btn-primary mb-3" @click="initData">초기화</button>
        </div>
        <h2>대충 차트 보여줌</h2>
    </div>
</template>

<script>
    import axios from 'axios'

    import XLSX from 'xlsx'

    export default {
        name: 'Home',

        data() {
            return {
                file: null,
                excelData: [],
                fileName: null
            }
        },

        created() {
            
        },

        mounted() {
            this.excelData = this.$store.state.excelData
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

                    this.$store.commit('setExcelData', XLSX.utils.sheet_to_json(excelData.Sheets['sheet']))
                    this.excelData = this.$store.getters.getExcelData
                    this.keyName = Object.keys(this.excelData[0])
                }

                reader.readAsBinaryString(this.file)
            },

            initData() {
                this.file = null
                this.$store.commit('setExcelData', [])
                this.excelData = this.$store.getters.getExcelData
            }
        }
    }
</script>