<template>
  <div>
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
          <div v-if="data.dir">
            <Input size="mini" style="width: 200px" v-model="data.mkdirPath">
              <Button size="mini" slot="append" type="text" @click="addDir(data)">添加目录</Button>
            </Input>
            <Button size="mini" type="text" @click="showUpload=true,fileData.path=data.path">上传文件</Button>
          </div>
        </div>
      </Tree>
    </div>
    <Dialog :visible.sync="showUpload">
      <Input>
        <span slot="prepend">标签</span>
      </Input>
      <Upload
        :action="$uploadUrl"
        multiple
        :data="fileData"
        :show-file-list="true"
        :auto-upload="false"
        ref="upload"
        :on-success="uploadOk"
      >
        <Button>选择文件</Button>
      </Upload>
      <Button @click="submitUpload">上传</Button>
    </Dialog>
    <div>
      <Input size="mini" style="width: 200px" v-model="mkdirPath.mkdirPath" >
        <Button size="mini" slot="append" type="text" @click="addDir(mkdirPath)">添加顶级目录</Button>
      </Input>
    </div>

    <footer>
      <Row>
        <Col :span="5">
          <Select v-model="pushMethod" size="mini">
            <Option value="random" label="随机各一份"></Option>
            <Option value="order" label="顺序"></Option>
            <Option value="together" label=" 都一样"></Option>
          </Select>
        </Col>
        <Col :span="5">
          <Select v-model="sRpath" size="mini">
            <Option v-for="(r,k) in Rpath" :value="r" :label="k"></Option>
          </Select>
        </Col>
        <Col :span="4">
          <Button @click="selectFiles">复制到手机</Button>
        </Col>
        <Button class="item" @click="addApp">安装应用</Button>
      </Row>

      <Row>
        <Col :span="5">
          <Select v-model="sRpath" size="mini">
            <Option v-for="(r,k) in Rpath" :value="r" :label="k"></Option>
          </Select>
        </Col>
        <Col :span="4">
          <Button @click="createDIR">创建</Button>
        </Col>
        <Col :span="4">
          <Button @click="restDIR">刷新</Button>
        </Col>
        <Col :span="4">
          <Button @click="deleteFile">删除</Button>
        </Col>
      </Row>
      <Row>
		<Col :span="4">
			<Button @click="addContacts">上传联系人</Button>
		</Col>
      </Row>
    </Footer>
  </div>
</template>

<script>
import {
  Upload,
  Button,
  Select,
  Option,
  Input,
  Tree,
  Dialog,
  Row,
  Col,
  Footer
} from "element-ui";
export default {
  name: "file",
  components: {
    Upload,
    Button,
    Select,
    Option,
    Input,
    Tree,
    Dialog,
    Row,
    Col,
    Footer
  },
  data() {
    return {
      pushMethod: "together",

      sRpath: "/sdcard/DCIM/Camera/",
      Rpath: {
        图片: "/sdcard/Pictures/",
        相册: "/sdcard/DCIM/Camera/",
    
      },
      showUpload: false,
      fileData: {
          path:""
      },
      key: {
        label: "name",
        isLeaf: "file"
      },
      mkdirPath:{
          mkdirPath:"",
          path:""
      }
    };
  },
  methods: {
        adbAction(cmd,type="shell",other=""){
        let d={
            cmd,
            type,
            other,
        }
        this.$store.dispatch("adbAction",d)
    },
    uploadOk() {
      this.showUpload = false;
    },
    handleCheckChange(data, checked) {
      console.log(checked, data);
      this.$store.state.SelectFile = checked.checkedNodes;
    },
    addDir(data) {
  
      this.$axios.post("/dir/add", {path:data.path+"/"+data.mkdirPath}).then(item => {
        if (item.status == 200) {
            data.mkdirPath=""
          this.$message("添加成功");
        }
      });
    },
    selectFiles() {
      let files = [];
      this.$store.state.SelectFile.map(item => {
        if (item.file) {
          files.push(item.path);
        }
      });
      let c = {
        type: "push",
  
         devices:this.$store.state.SelectDevice,
         Rpath: this.sRpath,
         Lpath: files,
         pushMethod: this.pushMethod
  
      };

      this.$axios.post("/devices/push",c).then((s)=>{
        if(s.status==200){
          this.$message("操作成功")
        }else{
                this.$message("error")
        }
      })
    },
    delContacts(){
        this.$confirm("确认是否删除").then(()=>{
              let c={
              type:"shell",
              cmd:"pm clear com.android.providers.contacts"
              }
          this.$store.dispatch("adbAction",c)
        })
    
    },
	addContacts(){
			let c={
				"devices":this.$store.state.SelectDevice
			}
			this.$axios.post("/clientAccount/addContacts",c).then((s)=>{
				if(s.status=='200'){
					this.$message("执行成功")
				}
			})
	 
	
	},
    submitUpload() {
      this.$refs.upload.submit();
    },

    addApp() {
      let d={
      
        "devices":this.$store.state.SelectDevice,
        "appPath":""
      }

      this.$store.state.SelectFile.map(item => {
        if (item.file) {
          d['appPath']=item.path
          this.$axios.post("/devices/install",d)
        }
      });
    },

    lodeNode(node, call) {
      let url = "/dir";
      if (node.level > 0) {
        url = url + "?path=" + encodeURIComponent(node.data.path);
      }
      this.$axios.get(url).then(item => {
        call(item.data);
      });
    },

    deleteFile() {
      let c = {
        type: "shell",
        cmd: " rm -rf " + this.sRpath + "*"
      };
      this.$store.dispatch("adbAction", c);
    },
    createDIR() {
      let c = {
        type: "shell",
        cmd: " mkdir " + this.sRpath
      };
      this.$store.dispatch("adbAction", c);
    },
    restDIR() {
      let c = {
        type: "shell",

        cmd:
          "am broadcast -a android.intent.action.MEDIA_MOUNTED -d " +
          this.sRpath
      };
      this.$store.dispatch("adbAction", c);
    }
  }
};
</script>

<style scoped>
.custom-tree-node :nth-child(n + 1) {
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  margin: 10px 0;
}
</style>