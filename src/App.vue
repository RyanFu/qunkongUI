<template>
    <div id="app" style="height: 100%;">
        <Container style="height: 100%;">
            <Container style="flex-direction: column;justify-content: space-between;height: 100%;">
                <Header>
                    群控系统
                    <Button size="mini" @click="rest">刷新</Button>

                    <Button size="mini" @click="mainDisplay=1">设备界面</Button>

                    <Button size="mini" @click="mainDisplay=2">任务</Button>
                    <Button size="mini" @click="$store.commit('createTask', !$store.state.isCreateTask )" :type=" $store.state.isCreateTask ? 'danger' :'' ">记录任务</Button>
                    <Tag type="success">{{connectText}}</Tag>
                    <ElSwitch v-model="$store.state.follow" active-text="跟随" ></ElSwitch>
                    <Button size="mini" @click="allSelect">全选</Button>
                    <Button size="mini" @click="$store.state.SelectDevice=[]">全不选</Button>


                </Header>
                <Main style="min-height: 40%">
                    <Devices  style="height: 100%;" v-show="mainDisplay==1"></Devices>

                    <tasks v-show="mainDisplay==2"></tasks>
                </Main>

                <KeyEvent>
                </KeyEvent>
            </Container>
        </Container>
    </div>
</template>
<script>
    import axios from "axios"
    import tasks from "@/components/tasks";
    import KeyEvent from "./components/keyEvent"
    import deviceFrom from "@/components/deviceFrom";
    import Devices from "@/components/Devices";
    import {Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,Button,Alert,Dialog,Switch,Tag} from "element-ui"
    export default {
        name: 'app',
        components: {
            Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,KeyEvent,Button,Devices,Alert,deviceFrom,Dialog,tasks,ElSwitch:Switch,Tag
        },
        data(){
            return{
                mainDisplay:1,
                connectText:"关闭",
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

