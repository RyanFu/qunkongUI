<template>
    <div style="font-size:12px">
        <Collapse>
            <CollapseItem title="按键">
                <Row>
                    <Col :span="7">
                        <Input  type="textarea" v-model="textValue"  size="mini"  style="width: 400px;"
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

                    <Col :span="6">
                        <Button @click="adbAction( '','tel')" type="danger"> 输入手机号</Button>
                        <Button   @click="adbAction('','name') ">名字</Button>
                        <Button   @click="adbAction('ime set com.ayunti/.adb')">输入法</Button>

                         <Input v-model="host" size="mini" @input="onHost()" > <span slot="prepend">ip</span></Input>

                    </Col>

                </Row>
                <Row>
                    <Button class="item" v-for="(code,k) in keyCode" @click="adbAction(code,'key')">{{k}}</Button>
                </Row>
            </CollapseItem>
            <CollapseItem title="app应用">
                    <Button  v-for="(item,k) in appList" class="item"   @click="adbAction( ' monkey -p '+item+' 1','shell') ">{{k}}</Button>

            </CollapseItem>

            <!-- <CollapseItem title="设置">
                <Row>
                     <Button @click="adbAction('svc wifi enable')">开启wifi </Button>
                     <Button @click="adbAction('svc wifi disable')">关闭wifi </Button>
                     <Button @click="adbAction('svc data enable')">开启流量 </Button>
                     <Button @click="adbAction('svc data disable')">关闭流量 </Button>
                </Row>
            </CollapseItem> -->
           
        </Collapse>

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
            Collapse,CollapseItem,
            Button:function () {
                Button.props.size={
                    default:"mini"
                }
                return Button
            }(),
            ButtonGroup,Input,Row,Col,Dialog,Form,FormItem,Select,Option,e_Switch:Switch,Tabs,TabPane,Popover
        },
        data(){
            return{
                host:localStorage.getItem("host"),
                inputCmd:"",
                dialogForm:false,
                textValue:"",
                show:[
                    "1"
                ],

              
                appList:{},
                keyCode:{},

            }
        },
        methods:{
            onHost(){
                localStorage.setItem("host",this.host)
            },
            key(e){
                let c={
                    Backspace:112,
                    b:30
                }
                this.adbAction(c[e.key],"key")
                console.log(e)
            },

            adbAction(cmd,type="shell",other=""){
                let d={
                    cmd,
                    type,
                    other,
                }
                this.$store.dispatch("adbAction",d)
            },


        },
        mounted(){
            this.appList=appList
            this.keyCode=keyCode


        }
    }
</script>
<style scoped>

</style>