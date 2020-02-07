<template>
    <div >
        <div class="custom-tree-container">
            <Tree
                    :props="key"
                    :load="lodeNode"
                    lazy
                    show-checkbox
                    :expand-on-click-node="false"
                    @check="handleCheckChange"
            >
            <div class="custom-tree-node" slot-scope="{ node, data }">
                         <span>{{data.name}}</span>
                <div v-if="node.data.type=='dir'">
                      <Input size="mini"  style="width: 200px" v-model="doAddDir[data.id]" ><Button size="mini" slot="append"  type="text" @click="addDir(data.id)">添加目录</Button></Input>
                        <Button size="mini" type="text" @click="showUpload=true,fileData.dirId=data.id">上传文件</Button>
                </div>
            </div>
            </Tree>
        </div>
        <Dialog :visible.sync="showUpload">
            <Input><span slot="prepend">标签</span> </Input>
            <Upload
                    :action=$uploadUrl
                    multiple
                    :data="fileData"
                    :show-file-list="false"
                    :auto-upload="false"
                    ref="upload"
                    :on-success="uploadOk"
            >
                <Button>选择文件</Button>
            </Upload>
            <Button @click="submitUpload"> 上传</Button>
        </Dialog>
        <div>
            <Input size="mini"  style="width: 200px" v-model="doAddDir[0]" ><Button size="mini" slot="append"  type="text" @click="addDir(0)">添加顶级目录</Button></Input>
        </div>
    </div>
</template>

<script>
    import {Upload,Button,Select,Option,Input,Tree,Dialog} from "element-ui"
    export default {
        name: "file",
        components:{
            Upload,Button,Select,Option,Input,Tree,Dialog
        },
        data(){
            return{
                showUpload:false,
                fileData:{
                    dirId:"",
                    tag:"",
                    md5:""
                },
                key:{
                    label:"name",
                    isLeaf: 'isChild'

                },
                doAddDir:{

                }
            }
        },
        methods:{
            uploadOk(){
                this.showUpload=false
            },
            handleCheckChange(data, checked) {

                 this.$store.state.SelectFile=checked.checkedNodes
            },
            addDir(d){

                  let   c={
                        name:this.doAddDir[d],
                        pid:d
                    }


                this.$axios.post('/dir/add',c).then(item=>{
                    console.log(item)
                })

            },
            submitUpload(){
                this.$refs.upload.submit()
            },
            lodeNode(node,call){
                if(node.level==0){
                    this.$axios.get("/dir/0").then(item=>{
                        let data=[]
                        for(let type in item.data){
                                item.data[type]['type']="dir"
                                data.push(item.data[type])
                        }
                        return  call(data)
                    })
                }

                if(node.isLeaf==false){
                    console.log(node)
                    this.getChild(node,call)
                }


            },
            getChild(node,call){
                this.$axios.get("/dir/child/"+node.data.id).then(item=>{
                    let data=[]
                    for(let type in item.data){
                        console.log(type)
                        for(let key in item.data[type]){
                            item.data[type][key]['type']=type
                            if(type=='file'){
                                item.data[type][key]['isChild']=true
                            }
                            data.push( item.data[type][key])
                        }
                    }
                    return  call(data)
                })
            }

        },
    }
</script>

<style scoped>
    .custom-tree-node :nth-child(n+1){
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;

    }
    .el-tree-node__content{
        margin: 10px 0;
    }
</style>