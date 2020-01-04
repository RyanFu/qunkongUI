<template>
    <div style="width: 200px">
            <Button size="small">{{connectText}}</Button>
        <div>
            <e_Switch v-for="i in devicesList" :key="i.adbId" v-model="i.status" :active-text="i.adbId"  @change="selectDevice(i.adbId,i.status)"></e_Switch>

        </div>
    </div>
</template>

<script>
    import {MenuItem,Menu,MenuItemGroup,Submenu,Alert,Button,Drawer,Table,TableColumn,RadioGroup,RadioButton,Switch} from "element-ui"
    export default {
        name: "Devices",
        components:{
            MenuItem,Menu,MenuItemGroup,Submenu,Alert,Button,Drawer,Table,TableColumn,RadioGroup,RadioButton,e_Switch:Switch
        },
        data(){
            return{
                isShow:false,
                connectText:"连接",
                devicesList:[],
                isCollapse:false
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

                        switch (data.action) {
                            case "ADD":
                                th.devicesList.push(data.device)
                                break;
                            case "REMOVE":
                                    th.remove(data.device)
                                break;
                        }
                    case "devicesList":
                        for(let d in data.list){
                            th.devicesList.push(data.list[d])
                        }
                        break;
                    case "device":
                        for (let d in th.devicesList){
                           if(th.devicesList[d].id == data.device.id){
                               console.log(d)
                               th.$set(th.devicesList,d,data.device)
                           }
                        }
                        break;
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
            getDevices(){
                let cmd={
                    type:"getDevices"
                }
                this.devicesList=[]
                this.ws.send(JSON.stringify(cmd))
            },



            selectDevice(id,s){
                let cmd={
                    type:"selectDevice",
                    status:s,
                    adbId:id
                }
               this.$socket.ws.send(JSON.stringify(cmd))
            }
        },


    }
</script>

<style scoped>

</style>