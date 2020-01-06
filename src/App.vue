<template>
    <div id="app" style="height: 100%;">
        <Container style="height: 100%;">
            <Devices  style="height: 100%;"></Devices>


            <Container style="flex-direction: column;justify-content: space-between;height: 100%;">
                <Header>
                    群控系统
                    <Button>添加任务计划</Button>
                </Header>
                <Main style="min-height: 40%">

                </Main>

                <KeyEvent>

                </KeyEvent>

            </Container>
        </Container>
    </div>
</template>
<script>
    import KeyEvent from "./components/keyEvent"
    import deviceFrom from "@/components/deviceFrom";
    import Devices from "@/components/Devices";
    import {Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,Button,Alert} from "element-ui"
    export default {
        name: 'app',
        components: {
            Row,Col,Menu,MenuItem,Submenu,MenuItemGroup,Header,Container,Aside,Footer,Main,KeyEvent,Button,Devices,Alert,deviceFrom
        },
        mounted(){
                this.$socket.int()
        }
    }
</script>
<style>
    body,html{
        height: 100%;
    }
</style>

