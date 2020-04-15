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
        }
    }

</script>
<style scoped>

</style>