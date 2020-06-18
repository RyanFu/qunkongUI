<template>
    <div>
        <Form size="mini"  label-width="auto" label-postion="right">

            <FormItem :model="$store.state.task" label="标题" style="width: 250px">
                <Input v-model="$store.state.task.title" />
            </FormItem>

            <FormItem label="任务描述">
                <Input v-model="$store.state.task.doc" style="width: 250px;"></Input>
            </FormItem>
            <FormItem label="动作">
                <Row style="min-height: 200px;border: 1px solid #ccc;padding: 10px">
                        <span v-for="(a,k) in $store.state.task.tasks">
                            <div >
                                <Input v-model="a.title" style="width: 150px;" size="mini"><span slot="prepend">名称</span></Input>
                                <Input v-model="a.action" style="width: 150px;" size="mini"><span slot="prepend">类型</span></Input>
                                <Input v-model="a.context" style="width: 250px;" size="mini"><span slot="prepend">执行内容</span></Input>
                                <Input v-model="a.sleep" style="width: 150px;" size="mini"><span slot="prepend">延迟执行</span></Input>
                                <e_Switch v-model="a.random" inactive-text="随机"></e_Switch>
                                <!-- <Input v-model="a.sort" style="width: 150px;" size="mini"><span slot="prepend">排序</span></Input> -->
                                <Tag @click="$store.state.task.tasks.splice(k,1)" size="mini">x</Tag>
                            </div>
                        </span>
                </Row>

            </FormItem>
            <FormItem>
                <Button type="primary" @click="add" size="mini">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import {Button,FormItem,Form,Input,Select,Option,Tag,Row,Switch} from "element-ui"
    export default {
        name: "tasks",
        components: {
            Button, FormItem, Form, Input, Select, Option, Tag,Row,e_Switch:Switch
        },

        data(){
            return{

            }
        },
        computed:{

        },
        created(){


        },
        methods:{
            add() {
                this.$axios.post("/task/add",this.$store.state.task).then(item=>{
                    if(item.status==200){
                        this.$message("保存成功")
                    }
                })
            }
        }


    }

</script>

<style scoped>

</style>