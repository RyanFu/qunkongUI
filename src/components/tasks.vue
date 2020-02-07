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

                <Input v-model="sleepTime.min" style="width: 50px"> </Input>
                <Input v-model="sleepTime.max"  style="width: 50px"> </Input>
                <Button @click="addSleep">间隔时间</Button>
                <Input v-model="task.count"><span slot="append">循环次数</span> </Input>

            </FormItem>
            <FormItem>
                <Button @click=" action()">执行</Button>
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
                task:{
                    count:1,
                    title:"",
                },
                sleepTime:{
                    min:3,
                    max:3
                }
            }
        },
        methods:{
           async action(){
                this.$store.commit('createTask',false)
                let a=this.$store.state.TaskAction
                for(let i=0;this.task.count>i;this.task.count-- ){
                    for (let t in a){
                        if(a[t].type=="sleep"){
                            console.log('sleeps')
                            if(a[t].max==a[t].min){
                                console.log(a[t].min*1000)
                                await  this.sleep(a[t].min*1000)

                            }else{
                                console.log(this.randomNum(a[t].min ,a[t].max) *1000)
                                await  this.sleep(this.randomNum(a[t].min ,a[t].max) *1000 )
                            }

                            console.log('sleepe')

                        }else{
                            this.$store.dispatch("adbAction",a[t])

                        }
                    }
                }

            },
            sleep(s){
                return new Promise(r=>setTimeout(r,s))
            },
            randomNum(minNum,maxNum){
                switch(arguments.length){
                    case 1:
                        return parseInt(Math.random()*minNum+1,10);
                        break;
                    case 2:
                        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                        break;
                    default:
                        return 0;
                        break;
                }
    },
    addSleep(){
               let c={
                   type:"sleep",
                   max:this.sleepTime.max,
                   min:this.sleepTime.min
               }
               this.$store.state.TaskAction.push(c)
            }


        }
    }
</script>

<style scoped>

</style>