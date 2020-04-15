<template>
    <div>
        <Table size="mini" :data="tasks">
            <TableColumn
                    prop="id"
                    label="Id"
            >
            </TableColumn>
            <TableColumn
                    prop="title"
                    label="标题"
            >
            </TableColumn>
            <TableColumn
                    prop="doc"
                    label="说明"
            >
            </TableColumn>
            <TableColumn
                    label="循环次数"
            >
                <template slot-scope="r">
                    <Input v-model="r.row.count" size="mini" style="width: 80px"></Input>
                    <Button size="mini" @click="run(r)">执行</Button>
                </template>
            </TableColumn>
            <TableColumn
                    label="操作"
            >
                <template slot-scope="r">
                    <Button size="mini" @click="edit(r.row)">编辑</Button>
                    <Button size="mini" @click="del(r.row)">删除</Button>
                </template>
            </TableColumn>
        </Table>
        <Pagination :total="total" layout="prev, pager, next, jumper, ->, total" :page-size="size" @current-change="page">

        </Pagination>
    </div>
</template>

<script>
    import {TableColumn,Table,Input,Button,Pagination,Dialog} from "element-ui"
    import tasks from "@/device/tasks";
    export default {
        name: "taskList",
        components:{
            TableColumn,Table,Input,Button,Pagination
        },
        data(){
            return{
                total:0,
                size:10,
                tasks:[]
            }
        },
        created(){
            this.page(1)
        },
        methods:{
            run(r){


                let d={
                    devices:this.$store.state.SelectDevice,
                    count:r.row.count,
                    taskId:r.row.id
                }
                if(d.devices.length<1){
                    this.$message("没有手机参与任务")
                    return;
                }
                if(d.count <1){
                    this.$message("循环任务 次数必须大于1")
                    return
                }
                this.$axios.post("/task/run",d).then(item=>{
                    if(item.status==200){
                        this.$message("任务开始运行")
                    }
                })
            },
            page(i){
                i=i-1
                this.$axios.get("/task/page/"+i).then(item=>{
                    this.tasks=item.data.content
                    this.total=item.data.totalElements
                    this.size=item.data.size
                })
            },
            del(i){
                this.$axios.get("task/del/"+i.id).then(item=>{
                    if(item.status==200){
                        this.tasks.splice(this.tasks.indexOf(i),1)
                        this.$message("删除成功")
                    }
                })
            },
            edit(i){

                this.$router.push({path:"/task"})
                this.$store.state.task=i
            }
        }
    }
</script>

<style scoped>

</style>