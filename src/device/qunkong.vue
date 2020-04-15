<template>
    <div style="height: 100%;">
            <Container style="flex-direction: column;justify-content: space-between;height: 100%;">
                <Header style="background-color: #DCDFE6;padding: 0;margin: 0;">
                    <Menu mode="horizontal">
                        <MenuItem>
                            <Button size="mini" @click="rest">刷新</Button>
                        </MenuItem>
                        <MenuItem>
                            <router-link to="/">
                                <Button size="mini">手机界面</Button>

                            </router-link>
                        </MenuItem>
                        <MenuItem>
                            <router-link to="/taskList">
                                <Button size="mini" >任务</Button>

                            </router-link>

                        </MenuItem>
                        <MenuItem>
                            <router-link to="/file">
                                <Button size="mini"> 文件管理</Button>
                            </router-link>

                        </MenuItem>
                        <MenuItem>
                            <router-link to="/task">
                                <Button size="mini" @click="$store.commit('createTask',true )" :type=" $store.state.isCreateTask ? 'danger' :'' ">添加任务</Button>

                            </router-link>

                        </MenuItem>

                        <MenuItem>
                            <ElSwitch v-model="$store.state.follow" active-text="群控" ></ElSwitch>

                        </MenuItem>
                        <MenuItem>
                            <Button size="mini" @click="allSelect">全选</Button>

                        </MenuItem>
                        <MenuItem>
                            <Button size="mini" @click="$store.state.SelectDevice=[]">全不选</Button>

                        </MenuItem>
                        <MenuItem>
                            <router-link to="/tel">
                                <Button size="mini"> 管理手机号</Button>

                            </router-link>

                        </MenuItem>
                        <MenuItem>
                            <Tag type="success">{{connectText}}</Tag>

                        </MenuItem>
                    </Menu>
                </Header>
                <Main style="min-height: 40%">
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive"></router-view>
                </Main>
                <KeyEvent>
                </KeyEvent>
            </Container>
    </div>
</template>
<script>
    import file from "./file"
    import tasks from "./tasks";
    import KeyEvent from "./keyEvent"
    import deviceFrom from "./deviceFrom";
    import Devices from "./Devices";
    import {Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,Button,Alert,Dialog,Switch,Tag,Form,FormItem,Input} from "element-ui"
    export default {
        name: 'qunkong',
        components: {
            Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,KeyEvent,Button,Devices,Alert,deviceFrom,Dialog,tasks,ElSwitch:Switch,Tag,file,FormItem,Form,Input
        },
        data(){
            return{
                fileSystem:false,
                mainDisplay:1,
                connectText:"关闭",
                showAddTel:false,

            }

        },
        methods:{

            rest(){
                this.$axios.get("/devices/rest").then(item=>{
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
            document.onkeyup=(e)=> {
                if(e.key=="Alt"){
                    let a;
                    if(this.$store.state.follow){
                        a=false
                    }else{
                        a=true
                    }

                    this.$store.commit("changeFollow",a);

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

