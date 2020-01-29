<template>
    <div>
        <Form>
            <FormItem :model="task" label="标题">
                <Input v-model="task.title" />
            </FormItem>
            <FormItem label="手机">
                <Select v-model="task.actions">
                    <Option v-for="d in $store.state.AllDevice" :label="d.title"></Option>
                </Select>
            </FormItem>
            <FormItem label="动作">
                <Button>循环</Button>
                <Button>间隔时间</Button>
            </FormItem>
            <FormItem>
                <Button>提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import {Button,FormItem,Form,Input,Select,Option} from "element-ui"
    export default {
        name: "tasks",
        components:{
            Button,FormItem,Form,Input,Select,Option
        },
        data(){
            return{
                task:{
                    title:"",
                    actions:[]
                }
            }
        }
    }
</script>

<style scoped>

</style>