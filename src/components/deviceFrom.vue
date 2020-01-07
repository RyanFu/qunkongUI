<template>
    <Form :model="device" label-width="80px">
        <FormItem>
            <span>{{device.adbId}}</span>
        </FormItem>
        <FormItem label="手机花名">
            <Input v-model="device.name"></Input>
        </FormItem>
        <FormItem label="手机号">
            <Row v-for="i in device.tel">
                {{i.context}}
            </Row>
            <Select v-model="selectTel">
                <Option v-for="tel in notBindTel" :value="tel.id" :key="tel.id" :label="tel.context"></Option>
            </Select>
            <Button @click="bindTel">绑定</Button>
        </FormItem>
        <FormItem>
            <Button @click="save()">保存</Button>
        </FormItem>
    </Form>
</template>

<script>
    import axios from "axios"
    import {FormItem ,Form,Button,Input,Select,Option,Row} from "element-ui"
    export default {
        name: "deviceFrom",
        components:{
            FormItem ,Form,Button,Input,Select,Option,Row
        },
        props:{
            device:{
                tel:[]
            }
        },
        data(){
            return{
                selectTel:"",
                tel:{},
                notBindTel:[]
            }
        },
        methods:{
            save(){
                axios.post("/device/update",this.device).then(item=>{
                    console.log(item.data)
                })
            },
            bindTel(){
                let d={
                    device_id:this.device.id,
                    tel_id:this.selectTel
                }
                axios.post("/device/bindTel",d).then(item=>{
                    console.log(item.data)
                })
                console.log(d)
            }
        },
        created(){
            axios.get("/tel/notBind").then(item=>{
                this.notBindTel=item.data
                console.log(item)
            })
        }
    }
</script>

<style scoped>

</style>