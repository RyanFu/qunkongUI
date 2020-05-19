<template>
  <div>
    <div sytle="display:flex">
      <CheckboxGroup v-model="$store.state.SelectDevice">
        <div v-for="(i,k) in $store.state.AllDevice" :key="i.adbId" style="display: inline-block">
          <div :style="i.style" style="position: relative;overflow: hidden">
            <div
              style="position: absolute;width: 100%;height: 100%;z-index: 999"
              :title="i.adbId"
              @mousedown="mouseStart"
              @mouseup="mouseEnd"
            ></div>
            <div
              style="position: absolute;width: 100%;height: 100%;z-index: 998;overflow: hidden;background-color: #fff"
              v-show="$store.state.log"
            >
              <div v-for="(m,k) in i.msg" style="font-size:12px">{{m}}</div>
            </div>
            <div style="position: absolute;width: 100%;height: 100%">
              <img width="100%" height="100%" :id="i.adbId" />
            </div>
          </div>
          <div>
            <Checkbox :label="k"></Checkbox>
            <Button @click="goTodevice(i)" size="mini">
              <span>信息</span>
            </Button>
            <Button @click="connectDevice(i.adbId)" size="mini">连接app</Button>
          </div>
        </div>
      </CheckboxGroup>
    </div>
    <div style="position:fixed;bottom:0px;width:100%">
     <KeyEvent></KeyEvent>
    </div>
    <Dialog :visible.sync="showDevice">
      <deviceFrom :device="deviceInfo"></deviceFrom>
    </Dialog>
  </div>
</template>

<script>
import KeyEvent from "./keyEvent";

import axios from "axios";
import deviceFrom from "@/device/deviceFrom";
import {
  MenuItem,
  Menu,
  MenuItemGroup,
  Submenu,
  Alert,
  Button,
  Drawer,
  Table,
  TableColumn,
  RadioGroup,
  RadioButton,
  Switch,
  Row,
  Col,
  Dialog,
  CheckboxGroup,
  Checkbox
} from "element-ui";
export default {
  name: "Devices",
  components: {
    KeyEvent,
    MenuItem,
    Menu,
    MenuItemGroup,
    Submenu,
    Alert,
    Button,
    Drawer,
    Table,
    TableColumn,
    RadioGroup,
    RadioButton,
    e_Switch: Switch,
    Col,
    Row,
    Dialog,
    deviceFrom,
    CheckboxGroup,
    Checkbox
  },
  data() {
    return {
      isShow: false,
      devicesList: [],
      deviceInfo: {},
      isCollapse: false,
      showDevice: false,
      xyStart: {
        x: "",
        y: "",
        t: ""
      },
      screen: {}
    };
  },

  created() {
    this.$socket.message["device"] = e => {
      let data = JSON.parse(e.data);

      switch (data.type) {
        case "screen":
          this.showScrren(data);
          break;
        case "msg":
          this.msg(data);
          break;
      }
    };
  },
  methods: {
    msg(data) {
      this.$store.commit("addMsg", data);
    },
    showScrren(data) {
      data.data = "data:image/jpg;base64," + data.data;
      this.screen[data.adbId] = data.data;
      let id = document.getElementById(data.adbId);
      if (id != null) {
        id.src = data.data;
      }
    },

    close() {
      isShow = false;
    },
    remove(device) {
      let th = this;
      th.devicesList.map(item => {
        if (item.adbId == device.adbId) {
          th.devicesList.splice(th.devicesList.indexOf(item), 1);
        }
      });
    },
    connectDevice(abdId) {
      axios.get("/device/device/connectDevice?adbId=" + abdId);
    },
    mouseStart(e) {
      this.$store.state.DoingDevice = e.target.title;

      console.log(e);

      this.xyStart = {
        x: e.offsetX,
        y: e.offsetY,
        t: new Date().getTime()
      };
    },
    mouseEnd(e) {
      let endX = e.offsetX;
      let endY = e.offsetY;
      let cmd = "";
      let type = "tap";
      let w = e.target.offsetWidth;
      let h = e.target.offsetHeight;

      if (
        Math.abs(endX - this.xyStart.x) > 3 ||
        Math.abs(endY - this.xyStart.Y) > 3 ||
        new Date().getTime() - this.xyStart.t > 500
      ) {
        cmd =
          this.xyStart.x / w +
          " " +
          this.xyStart.y / h +
          " " +
          e.offsetX / w +
          " " +
          e.offsetY / h +
          "   " +
          (new Date().getTime() - this.xyStart.t);
        type = "swipe";
      } else {
        cmd = e.offsetX / w + " " + e.offsetY / h;
      }
      let c = {
        cmd,
        type
      };
      this.$store.dispatch("adbAction", c);
    },
    goTodevice(device) {
      this.showDevice = true;
      this.deviceInfo = device;
    }
  }
};
</script>