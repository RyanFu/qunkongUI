
<script>
    import Vue from 'vue'
    import Vuex from 'vuex'
    Vue.use(Vuex)

    export default new Vuex.Store({
        state:{
            ws:WebSocket,

        },
        mutations:{
            setWs(state,socket){
                state.ws=socket
            }

        },
        actions:{
            conn(context,url) {
                try {
                    let ws= new WebSocket(url);
                    context.commit("setWs",ws)
                } catch (e) {
                    console.log("错误")
                }
            },
        },
    })
</script>