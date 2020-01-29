
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
            DoDevice:""
        },
        mutations:{
            addRunMsg(state,data){
                for(let i in state.AllDevice){
                    if(i==data.adbId){
                        delete data.adbId
                        state.AllDevice[i].msg.unshift(data.msg)
                    }
                }
            },
            setAllDevice(sate,data){
                sate.SelectDevice=[]
                sate.AllDevice={}
                for(let i in data){
                    let item=data[i]
                    item.status=true
                    item.msg=[]
                    if(item.size!=""){
                        let w=item.size.split("x",3)
                        item.style={width:w[0] /3 +'px',height:w[1] /3  +'px',border:"1px solid #409EFF",display:"inline-block",margin:"0 0 5px 5px"}
                    }
                    sate.SelectDevice.push(item.adbId)
                    sate.AllDevice[item.adbId]=item
                }

            }
        },
        actions:{
            adbAction({dispatch,state},data){

                let d=[]
                if(state.follow){
                    d=state.SelectDevice

                }else{
                    d=[state.DoDevice]

                }
                if(d.length<1){
                    alert("没有选择设备")
                    return
                }

               let c= {

                    devices:d,
                    cmd:data.cmd,
                    type:data.type,
                    other:data.other
                }
console.log(c)
                axios.post("/devices/runAdb",c)
            },
        },
        getters:{

        }
    })
</script>