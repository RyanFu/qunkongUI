<template>
    <div>
        <Tabs>
            <TabPane label="按键">
                <Row>
                    <Col :span="7">
                        <Input v-model="textValue"  type="text" style="width: 400px;"
                               @keyup.enter.native="adbAction('am broadcast -a ADB_INPUT_TEXT --es msg  '+ textValue),textValue=''"
                               @keyup.delete.native="adbAction('input keyevent 67')"
                               @keyup.down.native="adbAction('input keyevent 20')"
                               @keyup.up.native="adbAction('input keyevent 19')"
                               @keyup.left.native="adbAction('input keyevent 21')"
                               @keyup.right.native="adbAction('input keyevent 22')"
                        >

                        </Input>

                    </Col>
                    <Col :span="2">
                        <Button   @click="adbAction( textValue,'text')">输入</Button>
                    </Col>
                    <Col :span="2">
                        <Button   @click="adbAction(textValue)">shell命令</Button>
                    </Col>



                    <Col :span="4">
                        <Button @click="adbAction( '','tel')" type="danger"> 输入手机号</Button>
                        <Button   @click="adbAction('','name') ">名字</Button>

                    </Col>

                </Row>
                <Row>
                    <Button class="item" v-for="(code,k) in keyCode" @click="adbAction(code,'key')">{{k}}</Button>
                </Row>
            </TabPane>
            <TabPane label="app应用">
                    <Button  v-for="(item,k) in appList" class="item"   @click="adbAction( ' monkey -p '+item+' 1','shell') ">{{k}}</Button>

            </TabPane>

            <TabPane label="设置">
                <Row>
                     <Button @click="adbAction('svc wifi enable')">开启wifi </Button>
                     <Button @click="adbAction('svc wifi disable')">关闭wifi </Button>
                     <Button @click="adbAction('svc data enable')">开启流量 </Button>
                     <Button @click="adbAction('svc data disable')">关闭流量 </Button>
                </Row>
            </TabPane>
            <TabPane label="文件">
                <Row>
                    <Col :span="5">
                        <Select v-model="pushMethod">
                            <Option  value="random" label="随机各一份"></Option>
                            <Option value="order"  label="顺序"></Option>
                            <Option value="together"  label=" 都一样"></Option>
                        </Select>
                    </Col>
                    <Col :span="5">
                        <Select v-model="sRpath">
                            <Option v-for="(r,k) in Rpath"  :value="r" :label="k"></Option>
                        </Select>
                    </Col>
                    <Col :span="4">
                        <Button  @click="selectFiles">复制到手机</Button>
                    </Col>
                    <Button class="item" @click="addApp">安装应用</Button>

                </Row>
                <Row>
                    <Col :span="5">
                        <Select v-model="sRpath">
                            <Option v-for="(r,k) in Rpath"  :value="r" :label="k"></Option>
                        </Select>
                    </Col>
                    <Col :span="4">
                        <Button  @click="createDIR">创建</Button>
                    </Col>
                    <Col :span="4">
                        <Button  @click="restDIR">刷新</Button>
                    </Col>
                    <Col :span="4">
                        <Button  @click="deleteFile">删除</Button>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>

    </div>

</template>

<script>
    import keyCode  from "@/assets/keyCode"
    import appList  from "@/assets/app"
    import axios from "axios"
    import {Collapse,CollapseItem,Button,Input,Row,Col,Dialog,Form,FormItem,Select,Option,Switch,Tabs,TabPane,Popover,ButtonGroup} from "element-ui"
    export default {
        name: "keyEvent",
        components:{
            Collapse,CollapseItem,Button,ButtonGroup,Input,Row,Col,Dialog,Form,FormItem,Select,Option,e_Switch:Switch,Tabs,TabPane,Popover
        },
        data(){
            return{
                inputCmd:"",
                dialogForm:false,
                textValue:"",
                show:[
                    "1"
                ],

                sRpath:"",
                Rpath:{
                    "图片":"/sdcard/Pictures/",
                    "相册":"/sdcard/DCIM/Camera/"
                },
                pushMethod:'together',
                appList:{},
                keyCode:{},

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
                this.$store.state.SelectFile.map(item=>{
                    if(item.type=="file"){
                        this.adbAction(item.dir+item.md5+"."+item.suffix,"install")
                    }

                })

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
                let files=[]
                this.$store.state.SelectFile.map(item=>{
                    if(item.type=="file"){

                        let url=item.dir+item.md5+"."+item.suffix
                        files.push(url)
                    }
                })
                let c={
                    type:"push",
                    cmd:"",
                    other:{
                        Rpath:this.sRpath,
                        Lpath:files,
                        pushMethod:this.pushMethod

                    }
                }
              this.$store.dispatch("adbAction",c)
            },
            deleteFile(){
                let c={
                    type:"shell",
                    cmd:" rm -rf "+this.sRpath +"*",
                }
                this.$store.dispatch("adbAction",c)
            },
            createDIR(){
                let c={
                    type:"shell",
                    cmd:" mkdir "+this.sRpath,
                }
                this.$store.dispatch("adbAction",c)
            },
            restDIR(){
                let c={
                    type:"shell",

                    cmd:" broadcast -a android.intent.action.MEDIA_MOUNTED -d "+this.sRpath,
                }
                this.$store.dispatch("adbAction",c)
            }
        },
        mounted(){
            this.appList=appList
            this.keyCode=keyCode


        }
    }
</script>
<style scoped>

</style>