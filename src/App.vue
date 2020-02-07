<template>
    <div id="app" style="height: 100%;">
        <Container style="height: 100%;">
            <Container style="flex-direction: column;justify-content: space-between;height: 100%;">
                <Header>
                    <Tag>群控系统</Tag>
                    <Button size="mini" @click="rest">刷新</Button>
                    <Button size="mini" @click="mainDisplay=1">手机界面</Button>
                    <Button size="mini" @click="mainDisplay=2">任务</Button>
                    <Button @click="mainDisplay=3" size="mini"> 文件管理</Button>


                    <Button size="mini" @click="$store.commit('createTask', !$store.state.isCreateTask )" :type=" $store.state.isCreateTask ? 'danger' :'' ">记录任务</Button>
                    <Tag type="success">{{connectText}}</Tag>
                    <ElSwitch v-model="$store.state.follow" active-text="群控" ></ElSwitch>
                    <Button size="mini" @click="allSelect">全选</Button>
                    <Button size="mini" @click="$store.state.SelectDevice=[]">全不选</Button>
                    <Button @click="showAddTel=true" size="mini"> 添加手机号</Button>
                </Header>
                <Main style="min-height: 40%">
                    <Devices  style="height: 100%;" v-show="mainDisplay==1"></Devices>
                    <tasks v-show="mainDisplay==2"></tasks>
                    <file v-show="mainDisplay==3"></file>
                </Main>
                <KeyEvent>
                </KeyEvent>
            </Container>
        </Container>
        <Dialog :visible.sync="showAddTel">
            <Form>
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
        </Dialog>
    </div>
</template>
<script>
    import axios from "axios"
    import file from "@/components/file"
    import tasks from "@/components/tasks";
    import KeyEvent from "./components/keyEvent"
    import deviceFrom from "@/components/deviceFrom";
    import Devices from "@/components/Devices";
    import {Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,Button,Alert,Dialog,Switch,Tag,Form,FormItem,Input} from "element-ui"
    export default {
        name: 'app',
        components: {
            Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,KeyEvent,Button,Devices,Alert,deviceFrom,Dialog,tasks,ElSwitch:Switch,Tag,file,FormItem,Form,Input
        },
        data(){
            return{
                fileSystem:false,
                mainDisplay:1,
                connectText:"关闭",
                showAddTel:false,
                tel:{
                    name:"",
                    realName:"",
                    context:""
                }
            }

        },
        methods:{

            rest(){
                    axios.get("/devices/rest").then(item=>{
                        this.$store.commit("setAllDevice",item.data)
                    })
            },
            allSelect(){
                this.$store.state.SelectDevice=[]

                for(let k in this.$store.state.AllDevice){
                    this.$store.state.SelectDevice.push(k)
                }
            },
            addTel(){
                this.$axios.post("/tel/add",this.tel).then(item=>{
                    this.showAddTel=false
                    this.$message("添加成功")
                })
            }

        },
        created(){


            document.onkeydown=(e)=>{
                if(e.key=="Alt"){
                    console.log(e)

                    this.$store.commit("changeFollow",false);

                }
            }
            document.onkeyup=(e)=> {
                console.log(e)
                if(e.key=="Alt"){
                    console.log(e)
                    this.$store.commit("changeFollow",true);

                }
            }
            this.$socket.int()
            this.$socket.open.app= (e) =>{
                this.connectText="连接中"

            }
            this.$socket.close.app= (e)=> {
                this.connectText="已关闭"
            }
        },

    }
</script>
<style>
    body,html{
        height: 100%;
    }
</style>

