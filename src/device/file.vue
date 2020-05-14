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
        相册: "/sdcard/DCIM/Camera/"
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
        cmd: "",
        other: {
          Rpath: this.sRpath,
          Lpath: files,
          pushMethod: this.pushMethod
        }
      };
      this.$store.dispatch("adbAction", c);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
             adbAction(cmd,type="shell",other=""){
                let d={
                    cmd,
                    type,
                    other,
                }
                this.$store.dispatch("adbAction",d)
            },
    addApp() {
      this.$store.state.SelectFile.map(item => {
          console.log(item)
        if (item.file) {
          this.adbAction(item.path, "install");
        }
      });
    },

    lodeNode(node, call) {
      let url = "/dir";
      if (node.level > 0) {
        url = url + "?path=" + node.data.path;
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