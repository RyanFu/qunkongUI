<template>
    <Form size="mini" label-position="right">
        <FormItem label="花名">
            <Input v-model="tel.name"></Input>
        </FormItem>
        <FormItem label="注册人">
            <Input v-model="tel.realName"></Input>
        </FormItem>
        <FormItem label="手机号">
            <Input v-model="tel.context"></Input>
        </FormItem>
        <FormItem>
            <Button @click="addTel">提交</Button>
        </FormItem>
    </Form>
</template>

<script>
    import {Button,FormItem,Form,Input} from "element-ui"
    export default {
        name: "telForm",
        components:{
            Button,FormItem,Form,Input
        },
        props:{
            tel:{
                type:Object,
                default(){
                    return{
                        id:"",
                        name:"",
                        realName:"",
                        context:""
                    }
                }
            }
        },
        data(){
            return{

            }
        },
        methods:{
            addTel(){
                this.$axios.post("/tel/add",this.tel).then(item=>{
                    this.showAddTel=false
                    this.$message("添加成功")
                })
            }
        }
    }
</script>

<style scoped>

</style>