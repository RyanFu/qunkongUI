<template>
	<div>
		<Upload :action="uploadUrl">
			<Button>上传手机号</Button>
		</Upload>
		<Table :data="account" size="mini" >
			<TableColumn prop="id" label="ID"></TableColumn>
			<TableColumn prop="name" label="姓名"></TableColumn>
			<TableColumn prop="content" label="内容"></TableColumn>
			<TableColumn  label="所属号">
				<template slot-scope="r">
					<span v-if="r.row.etel">{{r.row.etel.context}}</span>
				</template>
			</TableColumn>
			<TableColumn prop="accountType" label="类型"></TableColumn>
			<TableColumn  label="操作" >
				<template slot-scope="r">
					<Button @click="del(r.row)">删除</Button>
				</template>
			</TableColumn>
		</Table>
		<Pagination :total="total" layout="prev, pager,next,slot" :page-size="size" @current-change="page">
			<Button @click="bindAll" v-loading.fullscreen.lock="autoLoading">自动分配</Button>
		</Pagination>
	</div>

</template>

<script>
import { Table, TableColumn, Button,Pagination,Upload } from 'element-ui'
export default {
    name:"clientAccount",
    components:{
        Table,TableColumn,Button,Pagination,Upload
    },
	data(){
		return {
			
			account:[],
			total:0,
			size:20,
			uploadUrl:this.$clientAccount,
			autoLoading:false
		}
	},
	methods:{
		page(p){
			this.$axios.get("/clientAccount/page/"+p).then((rsp)=>{
				if(rsp.status='200'){
					this.account=rsp.data.content
					this.total=rsp.data.totalElements
					this.size=rsp.data.size
				}
			})
		},
		del(r){
			this.$axios.get("/clientAccount/del/"+r.id).then((s)=>{
				if(s.status=="200"){
					this.account.splice(this.account.indexOf(r),1)
					this.$message("执行成功")
				}
			})
		},
		bindAll(){
			this.autoLoading=true
			this.$axios.get("/clientAccount/bindAll").then((r)=>{
				if(r.status=="200"){
					this.$message("自动分配成功")
				}
				this.autoLoading=false
			}).catch(()=>{
				this.autoLoading=false
			})
		}
	},
	mounted() {
		this.page(1)
	}
}
</script>

<style>

</style>