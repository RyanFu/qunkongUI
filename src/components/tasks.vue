<template>
    <div>
        <Form>
            <FormItem :model="task" label="标题">
                <Input v-model="task.title" />
            </FormItem>
            <FormItem>
                <span v-for="(a,k) in  $store.state.TaskAction">
                    <div >
                        {{a}}
                        <Tag @click="$store.state.TaskAction.splice(k,1)">x</Tag>
                    </div>
                </span>
            </FormItem>
            <FormItem label="动作">
                <Input v-model="count"></Input>
                <Button @click="action()">循环执行</Button>
                <Button @click="">间隔时间</Button>
            </FormItem>
            <FormItem>
                <Button>提交</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import {Button,FormItem,Form,Input,Select,Option,Tag} from "element-ui"
    export default {
        name: "tasks",
        components:{
            Button,FormItem,Form,Input,Select,Option,Tag
        },
        data(){
            return{
                count:1,
                task:{
                    title:"",
                }
            }
        },
        methods:{
           async action(){
                this.$store.commit('createTask',false)
                let a=this.$store.state.TaskAction
                for(let i=0;this.count>i;this.count-- ){
                    for (let t in a){
                        this.$store.dispatch("adbAction",a[t])
                      await  this.sleep(3000)


                    }
                }

            },
            sleep(s){
                return new Promise(r=>setTimeout(r,s))
            }


        }
    }
</script>

<style scoped>

</style>