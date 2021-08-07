<template>
    <div class="home">
        <div class="mb-3">
            <button class="btn btn-primary mr-3" @click="downloadData">데이터 다운로드</button>
            <button class="btn btn-primary mr-3" @click="zipImage">압축요청</button>
            <button class="btn btn-primary" @click="downloadImage">이미지 다운로드</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    import XLSX from 'xlsx'

    export default {
        name: 'About',

        data() {
            return {
                file: null,
                excelData: [],
                imageBuf: null,
                fileName: null
            }
        },

        created() {
            this.loadData()
        },

        methods: {
            async loadData() {
                let res = await axios.get('/dummy.json')
                this.excelData = res.data
            },

            downloadData() {
                const wb = XLSX.utils.book_new()
                // const tmp = this.excelData.splice(0, 500)
                const xlsx = XLSX.utils.json_to_sheet(this.excelData)
                const currData = new Date()

                XLSX.utils.book_append_sheet(wb, xlsx, `data_${currData.getTime()}`)

                XLSX.writeFile(wb, `data_${currData.getTime()}.xlsx`)
            },

            async zipImage() {
                let zipRes = await axios.get('/file/zip')
            },

            async downloadImage() {

                let res = await axios.get(`/file/download/output.zip`)
            },

            async loadImage(e) {
                const file = e.target.files[0]
                this.fileName = file.name
                // this.imageBuf = data

                this.imageBuf = await new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.readAsDataURL(file)
                    reader.onload = () => {
                        resolve(reader.result)
                    }
                })
            },

            async uploadImage() {
                if (!this.imageBuf) {
                    alert('파일이 없습니다.')
                    return false
                }

                let res = await axios.post('/file/upload', {
                    img: this.imageBuf,
                    fileName: this.fileName
                })

                console.log(res.data)
            }
        }
    }
</script>