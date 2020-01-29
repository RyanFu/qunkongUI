<template>
    <div id="app" style="height: 100%;">
        <Container style="height: 100%;">
            <Container style="flex-direction: column;justify-content: space-between;height: 100%;">
                <Header>
                    群控系统
                    <Button size="small" @click="rest">刷新</Button>
                    <Button size="small">{{connectText}}</Button>
                    <Button @click="addTaskForm=true">添加任务</Button>

                    <ElSwitch v-model="$store.state.follow" active-text="跟随" ></ElSwitch>
                </Header>
                <Main style="min-height: 40%">
                    <Devices  style="height: 100%;"></Devices>

                </Main>

                <KeyEvent>
                </KeyEvent>
            </Container>
        </Container>


        <Dialog :visible.sync="addTaskForm">
            <tasks></tasks>
        </Dialog>
    </div>
</template>
<script>
    import axios from "axios"
    import tasks from "@/components/tasks";
    import KeyEvent from "./components/keyEvent"
    import deviceFrom from "@/components/deviceFrom";
    import Devices from "@/components/Devices";
    import {Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,Button,Alert,Dialog,Switch} from "element-ui"
    export default {
        name: 'app',
        components: {
            Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,KeyEvent,Button,Devices,Alert,deviceFrom,Dialog,tasks,ElSwitch:Switch
        },
        data(){
            return{
                connectText:"关闭",
                addTaskForm:false,
            }

        },
        methods:{

            rest(){
                    axios.get("/devices/rest").then(item=>{
                        this.$store.commit("setAllDevice",item.data)
                    })
            },
        },
        created(){
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

