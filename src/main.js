import Vue from 'vue'
import App from './App.vue'
import store from "./store.vue"
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios"
import router from "./router"
import Message from "element-ui/packages/message/src/main";
import El from "element-ui"
Vue.use(El)
axios.defaults.baseURL="http://"+process.env.VUE_APP_APIURL+":9991"
Vue.prototype.$uploadUrl="http://"+process.env.VUE_APP_APIURL+":9991/file/upload"
Vue.config.productionTip = false
Vue.prototype.$axios=axios
Vue.prototype.$socket= {
    ws:WebSocket,
    open:{
        app:Function
    },
    message:{},
    error:{},
    close:{},
    int:function () {
      if(this.ws.readyState!=1){
        this.ws=new WebSocket("ws://"+process.env.VUE_APP_APIURL+":9999/ws")
      }
      this.ws.onopen= (e)=>{
          for (let  i in this.open){
            this.open[i](e)
          }
      }

      this.ws.onmessage= (e)=> {
        for (let i in this.message){
          this.message[i](e)
        }
      }

      this.ws.onerror= (e)=> {
        for (let i in this.error){
          this.error[i](e)
        }
      }

      this.ws.onclose= (e)=> {
        for (let i in this.close){
          this.close[i](e)
        }
      }

    },
}
Vue.prototype.$message=Message
new Vue({
    store,
    router,
  render: h => h(App),
}).$mount('#app')

