<template>
    <div id="app">
        <div class="container">

            <div id="nav">
                <router-link to="/" @click="sendData">종합</router-link> |
                <router-link to="/about" @click="sendData">데이터 관리</router-link>
            </div>

            <!-- <input type="file" @change="fileUpload"> -->
        </div>
        <router-view />
    </div>
</template>

<script>
    import EventBus from '@/EventBus'
    import XLSX from 'xlsx'

    export default {
        name: "App",

        data() {
            return {
                excelData: null
            }
        },

        mounted() {
            EventBus.$on('reqData', (res) => {
                this.sendData()
            })
        },

        methods: {
            sendData() {
                EventBus.$emit('resData', this.excelData)
            },

            fileUpload(e) {
                this.file = e.target.files[0]

                const reader = new FileReader()

                reader.onload = (e) => {
                    const data = reader.result
                    const excelData = XLSX.read(data, {
                        type: 'binary'
                    })
                    excelData.Sheets['Sheet2']['!ref'] = "A2:BC455"

                    this.excelData = XLSX.utils.sheet_to_json(excelData.Sheets['Sheet2'])
                    console.log(this.excelData)
                }

                if (this.file) this.sendData()
                reader.readAsBinaryString(this.file)
            }
        }
    }
</script>

<style lang="scss">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>