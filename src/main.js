import Vue from 'vue'
import App from './App.vue'
import store from "./store.vue"
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios"
axios.defaults.baseURL="127.0.0.1:9991"

Vue.config.productionTip = false

Vue.prototype.$socket= {
    ws:WebSocket,
    open:{},
    message:{},
    error:{},
    close:{},
    int:function () {
      if(this.ws.readyState!=1){
        this.ws=new WebSocket("ws://localhost:9999/ws")
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


new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
