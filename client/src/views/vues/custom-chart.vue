<template>
    <div class="custom">
        <div class="row">
            <div class="col-2">
                <div class="mb-3">
                    <strong>컬럼 목록</strong>
                </div>
                <draggable class="list-group" :list="original" group="custom" @change="log" style="height: 550px;overflow: auto;border: solid 1px;">
                    <div class="list-group-item mb-2" v-for="(item, idx) of original" :key="idx">
                        {{ item }}
                    </div>
                </draggable>
            </div>
            <div class="col-2">
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="mb-3">
                            <strong>기준 x축</strong>
                        </div>
                        <draggable class="list-group" :list="xCol" group="custom" @change="log" style="height: 250px;overflow: auto;border: solid 1px;">
                            <div class="list-group-item mb-2" v-for="(item, idx) of xCol" :key="idx">
                                {{ item }}
                            </div>
                        </draggable>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="mb-3">
                            <strong>기준 y축</strong>
                        </div>
                        <draggable class="list-group" :list="yCol" group="custom" @change="log" style="height: 250px;overflow: auto;border: solid 1px;">
                            <div class="list-group-item mb-2" v-for="(item, idx) of yCol" :key="idx">
                                {{ item }}
                            </div>
                        </draggable>
                    </div>
                </div>
            </div>
            <div class="col-8">

            </div>
        </div>
    </div>
</template>

<script>
    import { EventBus } from "../../components/EventBus"

    export default {
        name: 'custom',
        props: ['excelData'],
        data() {
            return {
                xCol: [1, 2],
                yCol: [3, 4],
                original: [],
            }
        },
        methods: {
            log(item) {

                return item
            }
        },

        mounted() {
            this.original = Object.keys(this.excelData[0])
        }
    }
</script>