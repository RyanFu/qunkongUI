<template>
    <div>
        <Tabs>
            <TabPane label="按键">
                <Row>
                    <Button class="item" v-for="code in keyCode" @click="adbAction('input keyevent '+code.value)">{{code.name}}</Button>
                </Row>
            </TabPane>
            <TabPane label="app应用">
                    <Button  v-for="item in appList" class="item"   @click="adbAction( ' monkey -p '+item.packageName+' 1','shell') ">{{item.name}}</Button>
                    <Button class="item" @click="installApp=true">安装应用</Button>

            </TabPane>
            <TabPane label="输入">
                <Row>
                    <Col :span="12">
                        <Input v-model="textValue"  style="width: 200px;">
                            <Button slot="append" @click="adbAction('input text '+ textValue)">输入</Button>
                        </Input>
                    </Col>
                    <Col :span="12">
                        <Button @click="adbAction( '','tel')"> 输入手机号</Button>

                    </Col>

                </Row>

                <Row>
                    <Col :span="5">
                        <Select v-model="pushMethod">
                            <Option  value="random" label="随机各一份"></Option>
                            <Option value="order"  label="顺序"></Option>
                            <Option value="together"  label=" 都一样"></Option>
                        </Select>
                    </Col>
                    <Col :span="10">
                        <Input class="item" v-model="files" placeholder="电脑路径(多路径空格隔开)"></Input>
                    </Col>
                    <Col :span="5">
                        <Select v-model="Rpath">
                            <Option  value="/sdcard/Pictures/" label="相册"></Option>
                            <Option value="order"  label="视频"></Option>
                        </Select>
                    </Col>
                    <Col :span="4">
                        <Button  @click="selectFiles">复制到手机</Button>
                    </Col>

                </Row>
            </TabPane>
            <TabPane label="设置">
                <Row>
                     <Button @click="adbAction('svc wifi enable')">开启wifi </Button>
                     <Button @click="adbAction('svc wifi disable')">关闭wifi </Button>
                     <Button @click="adbAction('svc data enable')">开启流量 </Button>
                     <Button @click="adbAction('svc data disable')">关闭流量 </Button>
                </Row>
            </TabPane>
        </Tabs>
<!--        添加命令-->

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
                inputCmd:"",
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
                Rpath:"/sdcard/Pictures/",
                pushMethod:'together',
                appList:[],
                keyCode:[],

            }
        },
        methods:{
            key(e){
                let c={
                    Backspace:112,
                    b:30
                }
                this.adbAction("input keyevent "+c[e.key])
                console.log(e)
            },
            addApp(){
                this.installApp=false
                this.adbAction(" -r "+this.app.path,"install")
            },


            adbAction(cmd,type="shell",other=""){
                let d={
                    cmd,
                    type,
                    other,
                }
                this.$store.dispatch("adbAction",d)
            },
            selectFiles(){
                let c={
                    type:"push",
                    cmd:"",
                    other:{
                        Rpath:this.Rpath,
                        Lpath:this.files,
                        pushMethod:this.pushMethod

                    }
                }
              this.$store.dispatch("adbAction",c)
            },
        },
        mounted(){
                axios.get("/app/all").then(item=>{
                        item.data.map(it=>{
                            this.appList.push(it)
                        })
                })
                axios.get("/adb/keyCode").then(item=>{
                    item.data.map(i=>{
                        this.keyCode.push(i)
                    })
                })


        }
    }
</script>

<style scoped>

</style>