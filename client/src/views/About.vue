<template>
    <div class="about">
        <div class="container mt-3 mb-3">
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
    import axios from 'axios'

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
            
        },

        mounted() {
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
            }
        }
    }
</script>