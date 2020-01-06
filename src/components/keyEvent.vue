<template>
    <div>
        <Tabs>
            <TabPane label="按键">
                <Row>
                    <Button class="item" v-for="cmd in cmdAll" @click="cmdAction(cmd.cmd)">{{cmd.name}}</Button>
                </Row>
            </TabPane>
            <TabPane label="app应用">
                <Popover  v-for="item in appList" trigger="hover">
                    <Button class="item" slot="reference"  @click="cmdAction( 'shell monkey -p '+item.packageName+' 1') ">{{item.name}}</Button>
                </Popover>

            </TabPane>
            <TabPane label="菜单栏">

                <Button class="item" @click="dialogForm=true">添加命令</Button>
                <Button class="item" @click="installApp=true">安装应用</Button>
                <Row>
                    <Select v-model="pushMethod">
                        <Option  value="random" lable="随机各一份"></Option>
                        <Option value="order"  label="都一样"></Option>
                        <Option value="together"  label="顺序"></Option>
                    </Select>
                    <Input class="item" v-model="files" ></Input>
                    <Button  @click="selectFiles">复制到手机</Button>
                </Row>
            </TabPane>
            <TabPane label="输入">
                <Row>
                    <Input class="item"  v-model="textValue" style="width: 200px;">
                        <Button slot="append" @click="text(textValue)">输入</Button>
                    </Input>
                </Row>
            </TabPane>

        </Tabs>
<!--        添加命令-->
        <Dialog title="自定义" :visible.sync="dialogForm">
            <Form :model="cmd">
                <FormItem >
                    <Input v-model="cmd.name" placeholder="命令名称"></Input>
                </FormItem>
                <FormItem>
                    <Input v-model="cmd.doc" placeholder="命令介绍"></Input>

                </FormItem>
                <FormItem>
                    <Input v-model="cmd.cmd" placeholder="命令内容"></Input>

                </FormItem>
                <FormItem>
                    <Button @click="addCmd">提交</Button>

                </FormItem>
            </Form>

        </Dialog>
        <Dialog title="安装应用" :visible.sync="installApp">
            <Form :model="app">
                <FormItem >
                    <Input v-model="app.path" placeholder="全路径"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="addApp">提交</Button>
                </FormItem>
            </Form>
        </Dialog>
    </div>

</template>

<script>
    import axios from "axios"
    import {Collapse,CollapseItem,Button,Input,Row,Col,Dialog,Form,FormItem,Select,Option,Switch,Tabs,TabPane,Popover} from "element-ui"
    export default {
        name: "keyEvent",
        components:{
            Collapse,CollapseItem,Button,Input,Row,Col,Dialog,Form,FormItem,Select,Option,e_Switch:Switch,Tabs,TabPane,Popover
        },
        data(){
            return{
                files:"",
                dialogForm:false,
                installApp:false,
                textValue:"",
                show:[
                    "1"
                ],
                app:{
                    path:""
                },
                pushMethod:'random',
                appList:[],
                cmdAll:[],
                cmd:{
                    name:"",
                    cmd:"",
                    doc:""
                }
            }
        },
        methods:{
            addCmd(){
                let c={
                    type:"addCmd",
                    data:this.cmd

                }
                this.$socket.ws.send(JSON.stringify(c))
            },
            addApp(){
                this.installApp=false
                let c={
                    type:"installApp",
                    cmd:"install "+ this.app.path
                }
                this.$socket.ws.send(JSON.stringify(c))
            },
            cmdAction(str){
                let c={
                    type:"runCmd",
                    devices:this.$store.state.SelectDevice,
                    cmd:str
                }
                this.$socket.ws.send(JSON.stringify(c))
            },
            text(str){
                this.cmdAction("shell input text "+str)
            },
            selectFiles(){
                let c={
                    type:"push",
                    data:this.files,
                    method:this.pushMethod,
                    Rpath:"/sdcard/DCIM/Camera"
                }
                this.$socket.ws.send(JSON.stringify(c))
            }
        },
        mounted(){
            this.$socket.message["cmd"]=(e)=>{
                let d=JSON.parse(e.data);
                switch (d.type) {
                        case "cmd":

                            this.cmdAll=d.data
                        break

                }
            },
                axios.get("/app/all").then(item=>{
                        item.data.map(it=>{
                            this.appList.push(it)
                        })
                })


        }
    }
</script>

<style scoped>
    .item{
        margin:10px;
    }
</style>