<template>
    <div id="app" style="height: 100%;">
         <router-view ></router-view>
    </div>
</template>
<script>

    import {Header,Container,Menu,MenuItem} from "element-ui"
    export default {
        components:{
            Header,Container,Menu,MenuItem
        },
        created(){
            this.$axios.get("/devices/all").then(item=>{
                if(item.status==200){
                    this.$store.commit("setAllDevice",item.data)
                }
            })


        },
    }

</script>
<style scoped>

</style>