<template>
    <div style="width: 200px">
            <Button size="small">{{connectText}}</Button>
            <Button size="small" @click="rest">刷新</Button>
        <div>
            <Row v-for="i in $store.state.AllDevice" :key="i.adbId" >
                <e_Switch v-model="i.status"  @change="selectDevice(i,i.status)"></e_Switch>
                <Button @click="goTodevice(i)" v-if="i.name!=null"> {{i.name}}</Button>
                <Button @click="goTodevice(i)" v-else> {{i.adbId}}</Button>
            </Row>
        </div>
        <Dialog :visible.sync="showDevice">
            <deviceFrom :device="deviceInfo">
            </deviceFrom>
        </Dialog>
    </div>
</template>

<script>
    import Vue from "vue"
    import deviceFrom  from "@/components/deviceFrom";
    import {MenuItem,Menu,MenuItemGroup,Submenu,Alert,Button,Drawer,Table,TableColumn,RadioGroup,RadioButton,Switch,Row,Col,Dialog} from "element-ui"
    export default {
        name: "Devices",
        components:{
            MenuItem,Menu,MenuItemGroup,Submenu,Alert,Button,Drawer,Table,TableColumn,RadioGroup,RadioButton,e_Switch:Switch,Col,Row,Dialog,deviceFrom
        },
        data(){
            return{
                isShow:false,
                connectText:"连接",
                devicesList:[],
                deviceInfo:{},
                isCollapse:false,
                showDevice:false,
            }
        },

        mounted(){
            let th=this
            this.$socket.open["devices"]= (e)=>{
                this.connectText="已连接"
            }
            this.$socket.message["devices"]= (event)=>{
                let data=JSON.parse(event.data)
                switch (data.type) {
                    case "devices":

                        this.$store.commit("setAllDevice",data.device)

                        break
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
            goTodevice(device){
                this.showDevice=true
                this.deviceInfo=device
 
            },
            rest(){
                let cmd={
                    type:"restDevices",
                }
                this.$socket.ws.send(JSON.stringify(cmd))
            },
            selectDevice(device,status){
                if(status){
                    this.$store.commit("addSelectDevice",device)
                }else{
                    this.$store.commit("reSelectDevice",device)
                }
            }
        },


    }
</script>

<style scoped>

</style>