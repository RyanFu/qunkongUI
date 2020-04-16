
<script>
    import axios from "axios"
    import Vue from 'vue'
    import Vuex from 'vuex'
    Vue.use(Vuex)
    export default new Vuex.Store({
        state:{
            SelectDevice:[],
            AllDevice:{},
            follow:true,
            DoingDevice:"",
            task:{
                id:"",
                title: "",
                doc:"",
                tasks:[]
            },
            isCreateTask:false,
            SelectFile:[]

        },
        mutations:{
            changeFollow(state,bool){
                state.follow=bool
            },
            addRunMsg(state,data){
                for(let i in state.AllDevice){
                    if(i==data.adbId){
                        delete data.adbId
                        state.AllDevice[i].msg.unshift(data.msg)
                    }
                }
            },
            createTask(state,bool){
                state.isCreateTask=bool
            },
            setAllDevice(sate,data){
                sate.SelectDevice=[]
                sate.AllDevice={}
                for(let i in data){
                    let item=data[i]
                    item.status=true
                    item.msg=[]
                    if(item.edevice.width!=""){
                        item.style={
                            width:item.edevice.width /4 +'px',
                            height:item.edevice.height/4  +'px',
                            border:"1px solid #409EFF",
                            display:"inline-block",margin:"0 0 5px 5px"}
                    }
                    sate.SelectDevice.push(item.adbId)
                    sate.AllDevice[item.adbId]=item
                }

            }
        },
        actions:{
            adbAction({dispatch,state},data){
                console.log(data.type)
                if(state.isCreateTask){
                    let ts={
                        title:"",
                        context:data.cmd,
                        action:data.type,
                        sort:1,
                        sleep:1,
                        random:false
                    }
                    state.task.tasks.push(ts)
                }
                let d=[]
                if(state.follow){
                    d=state.SelectDevice

                }else{
                    d=[state.DoingDevice]

                }
                if(d.length<1){
                    return
                }

               let c= {

                    devices:d,
                    cmd:data.cmd,
                    doing:state.DoingDevice,
                    type:data.type,
                    other:data.other
                }
                axios.post("/devices/runAdb",c)
            },
        },
        getters:{

        }
    })
</script>