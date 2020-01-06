
<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    Vue.use(Vuex)

    export default new Vuex.Store({
        state:{
            SelectDevice:[],
            AllDevice:[],
            InfoDevice:[],
        },
        mutations:{
            addSelectDevice(state,data){
                state.SelectDevice.push(data)
            },
            reSelectDevice(state,data){
                let index = state.SelectDevice.findIndex(item => {
                    if (item.id == data.id) {
                        return true;
                    }
                })
                state.SelectDevice.splice(index,1)

            },
            setAllDevice(sate,data){
                sate.AllDevice=data
            }
        },
        actions:{

        },
        getters:{

        }
    })
</script>