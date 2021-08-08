<template>
    <div class="home">
        <div class="mb-3">
            <button class="btn btn-primary mr-3" @click="downloadData">데이터 다운로드</button>
            <button class="btn btn-primary mr-3" @click="zipImage_js">압축요청(Js)</button>
            <button class="btn btn-primary mr-3" @click="zipImage_python">압축요청(Python)</button>
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

            async zipImage_python() {
                let zipRes = await axios.get('/file/zip/python')
                console.log
            },
            
            async zipImage_js() {
                let zipRes = await axios.get('/file/zip/js')
                this.fileName = zipRes.data.fileName
                // window.location.href = `/file/zip/js/${zipRes.data.fileName}`
            },

            async downloadImage() {
                
                // await axios.get(`/file/download/2_${this.fileName}`)
                // window.location.href = `/file/download/2_${this.fileName}`
                await axios.get(`/file/download/1_1628360848831_output.zip`)
                window.location.href = `/file/download/1_1628360848831_output.zip`
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