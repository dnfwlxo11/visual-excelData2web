<template>
    <div class="about">
        <div class="container mt-3 mb-3">
            <div class="mb-3">
                <input type="file" @change="loadImage" accept="image/*" entype="multipart/form-data">
                <button class="btn btn-secondary" @click="uploadImage">업로드</button>
            </div>
            <div class="mb-5">
                <h1>데이터 개수 : {{ excelData.length }}</h1>
            </div>
            <div class="mb-3">
                <button class="btn btn-primary mr-3" @click="downloadData">데이터 다운로드</button>
                <button class="btn btn-primary" @click="downloadImage">이미지 다운로드</button>
            </div>
            <!-- <div v-if="excelData" class="row" style="max-width:inherit;max-height:500px;overflow: auto;white-space:nowrap;">
                <table class="table">
                    <thead>
                        <th v-for="(item, idx) of standardKey" :key="idx">
                            {{item}}
                        </th>
                    </thead>
                    <tr v-for="(value, idx_tr) in excelData" :key="idx_tr">
                        <th v-for="(item, idx_th) of standardKey" :key="idx_th">
                            {{ value[item] }}
                        </th>
                    </tr>
                </table>
            </div> -->
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
                excelData: [],
                imageBuf: null,
                fileName: null,
                standardKey: ["등록번호", "생년월일", "성별", "검사날짜",
                    "R-AC-125", "R-AC-250", "R-AC-500", "R-AC-1K", "R-AC-2K", "R-AC-3K", "R-AC-4K", "R-AC-6K",
                    "R-AC-8K",
                    "R-BC-250", "R-BC-500", "R-BC-1K", "R-BC-2K", "R-BC-3K", "R-BC-4K",
                    "L-AC-125", "L-AC-250", "L-AC-500", "L-AC-1K", "L-AC-2K", "L-AC-3K", "L-AC-4K", "L-AC-6K",
                    "L-AC-8K",
                    "L-BC-250", "L-BC-500", "L-BC-1K", "L-BC-2K", "L-BC-3K", "L-BC-4K",
                    "우측 SRT", "좌측 SRT", "우측 WRS", "우측 레벨", "좌측 WRS", "좌측 레벨",
                    "우측 원인1", "우측 원인2", "우측 원인3",
                    "좌측 원인1", "좌측 원인2", "좌측 원인3",
                    "우측 고막1", "우측 고막2", "우측 고막3",
                    "좌측 고막1", "좌측 고막2", "좌측 고막3",
                    "우측", "좌측"
                ],
                // combineExcelStandardKey: {
                //     "등록번호": "등록번호",
                //     "생년월일": "생년월일",
                //     "성별": "성별",
                //     "검사날짜": "검사날짜",
                //     "R-AC-125": "125",
                //     "R-AC-250": "250",
                //     "R-AC-500": "500",
                //     "R-AC-1K": "1K",
                //     "R-AC-2K": "2K",
                //     "R-AC-3K": "3K",
                //     "R-AC-4K": "4K",
                //     "R-AC-6K": "6K",
                //     "R-AC-8K": "8K",
                //     "R-BC-250": "250_1",
                //     "R-BC-500": "500_1",
                //     "R-BC-1K": "1K_1",
                //     "R-BC-2K": "2K_1",
                //     "R-BC-3K": "3K_1",
                //     "R-BC-4K": "4K_1",
                //     "L-AC-125": "125_1",
                //     "L-AC-250": "250_2",
                //     "L-AC-500": "500_2",
                //     "L-AC-1K": "1K_2",
                //     "L-AC-2K": "2K_2",
                //     "L-AC-3K": "3K_2",
                //     "L-AC-4K": "4K_2",
                //     "L-AC-6K": "6K_1",
                //     "L-AC-8K": "8K_1",
                //     "L-BC-250": "250_3",
                //     "L-BC-500": "500_3",
                //     "L-BC-1K": "1K_3",
                //     "L-BC-2K": "2K_3",
                //     "L-BC-3K": "3K_3",
                //     "L-BC-4K": "4K_3",
                //     "우측 SRT": "우측 SRT",
                //     "좌측 SRT": "좌측 SRT",
                //     "우측 WRS": "우측 WRS",
                //     "우측 레벨": "우측 레벨",
                //     "좌측 WRS": "좌측 WRS",
                //     "좌측 레벨": "좌측 레벨",
                //     "우측 원인1": "우측 원인1",
                //     "우측 원인2": "우측 원인2",
                //     "우측 원인3": "우측 원인3",
                //     "좌측 원인1": "좌측 원인1",
                //     "좌측 원인2": "좌측 원인2",
                //     "좌측 원인3": "좌측 원인3",
                //     "우측 고막1": "우측 고막1_1",
                //     "우측 고막2": "우측 고막2_1",
                //     "우측 고막3": "우측 고막3_1",
                //     "좌측 고막1": "좌측 고막1_1",
                //     "좌측 고막2": "좌측 고막2_1",
                //     "좌측 고막3": "좌측 고막3_1",
                //     "우측": "우측",
                //     "좌측": "좌측"
                // }
            }
        },

        created() {
            // EventBus.$on('resData', (res) => {
            //     this.excelData = res
            // })
            // EventBus.$emit('reqData', '안녕')
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

            async downloadImage() {
                let res = await axios.get('http://localhost:3000/file/download')
                console.log(res.data)
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

                let res = await axios.post('http://localhost:3000/file/upload', {
                    img: this.imageBuf,
                    fileName: this.fileName
                })

                console.log(res.data)
            }

            // fileUpload(e) {
            //     this.file = e.target.files[0]

            //     const reader = new FileReader()

            //     reader.onload = (e) => {
            //         const data = reader.result
            //         const excelData = XLSX.read(data, {
            //             type: 'binary'
            //         })
            //         excelData.Sheets['Sheet2']['!ref'] = "A2:BC455"

            //         this.excelData = XLSX.utils.sheet_to_json(excelData.Sheets['Sheet2'])
            //         this.setKeyName(Object.keys(this.excelData[0]))
            //     }

            //     reader.readAsBinaryString(this.file)
            // },
        }
    }
</script>