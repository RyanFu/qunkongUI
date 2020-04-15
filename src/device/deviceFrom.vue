<template>
    <Form :model="device" label-width="80px">
        <FormItem label="adbId:">
            <span>{{device.adbId}}</span>
        </FormItem>

        <FormItem label="手机号">
            <Row v-for="i in device.edevice.tel">
                <span>{{i.name}}</span>
                <span>:-----:</span>
                <span>                {{i.context}}</span>
            </Row>
            <Select v-model="selectTel">
                <Option v-for="tel in notBindTel" :value="tel.id" :key="tel.id" :label="tel.context"></Option>
            </Select>
            <Button @click="bindTel">绑定</Button>
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
                edevice:{
                    name:""
                }
            }
        },
        data(){
            return{
                selectTel:"",
                tel:{},
                notBindTel:[]
            }
        },
        beforeMount(){
            let vm=this
            if(vm.device.edevice instanceof Object ==false){
                vm.device.edevice={
                    name:"",
                    adbId:vm.device.adbId
                }
            }
        },
        methods:{
            bindTel(){

                let d={
                    device_id:this.device.edevice.id,
                    tel_id:this.selectTel
                }
                axios.post("/device/bindTel",d).then(item=>{
                    if(item.status==200){
                        this.$message("添加成功，刷新")
                    }
                })

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