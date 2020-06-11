<template>
    <div>
		<Menu>
			<router-link to="/clientAccount">
				<MenuItem >客户手机号</MenuItem>
			</router-link>
		</Menu>
        <Table :data="tel" size=mini>
            <TableColumn label="ID" prop="id"></TableColumn>
            <TableColumn label="花名" prop="name"></TableColumn>
            <TableColumn label="手机号" prop="context"></TableColumn>
            <TableColumn label="手机adbId" prop="device.adbId"></TableColumn>
            <TableColumn label="操作">
                <template slot-scope="r">
                    <Button @click="edit(r.row)">编辑</Button>
                    <Button @click="delDevice(r.row)">解绑</Button>
                    <Button @click="del(r.row)">删除电话号</Button>
                </template>
            </TableColumn>
        </Table>
        <Pagination :total="total" layout="prev,next,slot" @current-change="page" :page-size='size'>
            <Button @click="showAdd">添加手机号</Button>
        
        </Pagination>
    </div>
</template>

<script>
    import form from './telForm'
    import {Button,TableColumn,Table,Pagination,MessageBox,Menu,MenuItem} from "element-ui"
	
    export default {
        name: "tel",
        components:{
            Button,TableColumn,Table,Pagination,Menu,MenuItem
        },
        data(){
            return{
                tel:[],
                total:0,
				size:20
            }
        },
        methods:{
            page(i){
                this.$axios.get("/tel/list/"+i).then(item=>{
                    if(item.status==200){
                        this.tel=item.data.content
                        this.total=item.data.total
                        this.total=item.data.size

                    }
                })
            },
            showAdd(){
                let h=this.$createElement
                MessageBox({
                    showConfirmButton:false,
                    message:h(form)
                })
            },
            edit(d){
                let h=this.$createElement
                MessageBox({
                    showConfirmButton:false,
                    message:h(form,{props:{tel:d}})
                })
            },
            del(i){
                this.$confirm("确定要删除吗").then(()=>{
                    this.$axios.get("/tel/del/"+i.id).then(item=>{
                        if(item.status==200){
                            this.tel.splice(this.tel.indexOf(i),1)
                            this.$message("操作成功")
                        }
                    })
                })

            },
            delDevice(i){
					
				this.$confirm("确定解绑？").then(()=>{
					this.$axios.post("/tel/delDevice",i).then(item=>{
					    if(item.status==200){
					        this.$message("操作成功")
					    }
					})
				})
        


            }
        },
        mounted(){
            this.page(1)
        }
    }
</script>

<style scoped>

</style>