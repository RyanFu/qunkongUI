<template>
    <div>
        <div sytle="display:flex">
            <Button>全选</Button>
            <CheckboxGroup v-model="$store.state.SelectDevice">
            <div v-for="(i,k) in $store.state.AllDevice" :key="i.adbId"  style="display: inline-block">
                <div   :style="i.style" style="position: relative;overflow: hidden" >
                    <div style="position: absolute;width: 100%;height: 100%;z-index: 999" :title="i.adbId"  @mousedown="mouseStart" @mouseup="mouseEnd" >

                        <div  id="video"></div>

                    </div>
                    <div style="position: absolute;width: 100%;height: 100%" :id="i.adbId"></div>
                    <p style="font-size: 10px;overflow: hidden" v-for="m in i.msg">{{m}}</p>
                </div>
                <div>
                    <Checkbox :label="i.adbId"></Checkbox>
<!--                    <Button @click="goTodevice(i)" v-if="i.name!=null" style="font-size: 12px">-->
<!--                        {{i.name}}-->
<!--                        <span v-for="t in i.tel" style="font-size: 12px">-->
<!--                        {{t.context}}-->
<!--                        </span>-->
<!--                    </Button>-->
<!--                    <Button @click="goTodevice(i)" v-else> {{i.adbId}}</Button>-->
                    <span v-if="i.channel == null ">
                            <span v-if="i.channel.active">
                                连接中
                            </span>
                    </span>
                    <Button @click="connectDevice(i.adbId)" >连接app</Button>
                </div>
            </div>
            </CheckboxGroup>
        </div>
        <Dialog :visible.sync="showDevice">
            <deviceFrom :device="deviceInfo">
            </deviceFrom>
        </Dialog>
    </div>
</template>

<script>
    import axios from "axios"
    import deviceFrom  from "@/components/deviceFrom";
    import {MenuItem,Menu,MenuItemGroup,Submenu,Alert,Button,Drawer,Table,TableColumn,RadioGroup,RadioButton,Switch,Row,Col,Dialog,CheckboxGroup,Checkbox} from "element-ui"
    export default {
        name: "Devices",
        components:{
            MenuItem,Menu,MenuItemGroup,Submenu,Alert,Button,Drawer,Table,TableColumn,RadioGroup,RadioButton,e_Switch:Switch,Col,Row,Dialog,deviceFrom,CheckboxGroup,Checkbox
        },
        data(){
            return{
                isShow:false,
                devicesList:[],
                deviceInfo:{},
                isCollapse:false,
                showDevice:false,
                xyStart:{
                    x:"",
                    y:"",
                    t:""
                },
                screen:{}

            }
        },
        created(){
            axios.get("/devices/all").then(item=>{
                this.$store.commit("setAllDevice",item.data)

            })
            this.$socket.message["device"]=(e)=>{
                let data= JSON.parse(e.data)

                if(data.type=="device"){
                    delete data.type
                    this.$store.commit("addRunMsg",data)
                }
                if(data.type=="screen"){
                    // var bytes = new Uint8Array(data.data);
                    // var blob = new Blob([bytes], { type: "image/JPEG" });
                    // var url = URL.createObjectURL(blob);

                    data.data="data:image/jpg;base64,"+data.data;
                    this.screen[data.adbId]=data.data
                    let id=document.getElementById(data.adbId)
                    let h=document.createElement("img")
                    h.width=id.offsetWidth
                    h.height=id.offsetHeight
                    h.src=data.data
                    while(id.hasChildNodes()) //当div下还存在子节点时 循环继续
                    {
                        id.removeChild(id.firstChild);
                    }
                    id.append(h)
                }
            }

        },
        methods:{
            close(){
                isShow=false
            },
            remove(device){
                let th=this
                th.devicesList.map(item=>{
                    if(item.adbId == device.adbId){
                        th.devicesList.splice(th.devicesList.indexOf(item),1)
                    }
                })

            },
            connectDevice(abdId){
                axios.get("/device/device/connectDevice?adbId="+abdId,)
            },
            mouseStart(e){
                this.$store.state.DoDevice=e.target.title

                this.xyStart={
                    x:e.offsetX,
                    y:e.offsetY,
                    t:(new Date()).getTime()
                }
            },
            mouseEnd(e){
                let endX=e.offsetX
                let endY=e.offsetY
                let cmd="";
                if(  Math.abs( (endX - this.xyStart.x) )   > 3 ||  Math.abs( (endY- this.xyStart.Y) )>3  ){
                    cmd="input swipe " +this.xyStart.x * 3 +" "+this.xyStart.y * 3 + " " +e.offsetX * 3 + " "+e.offsetY * 3 +"   " + ((new Date()).getTime() - this.xyStart.t )
                }else{
                     cmd="input tap " +e.offsetX * 3 + " "+e.offsetY * 3
                }

                let c={
                    cmd,
                    type:"shell"
                }
                this.$store.dispatch("adbAction",c)
            },
            goTodevice(device){
                this.showDevice=true
                this.deviceInfo=device
 
            },

        },


    }
</script>

<style scoped>

</style>