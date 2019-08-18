<template>
  <div id="components-layout-demo-basic">
    <a-layout>
      <a-layout-sider>
        <a-list itemLayout="horizontal" :dataSource="userList">
          <a-list-item slot="renderItem" slot-scope="item">
            <a-list-item-meta>
              <a slot="title" href="#">{{item.title}}</a>
              <a-avatar
                slot="avatar"
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              />
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-layout-sider>
      <a-layout>
        <a-layout-header>
          <div>Vue 在线聊天室</div>
          <div>{{uname}}</div>
        </a-layout-header>
        <a-layout-content>
          <a-list
            v-if="chatContentList.length"
            :dataSource="chatContentList"
            itemLayout="horizontal"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a-comment :author="item.author" :avatar="item.avatar" :datetime="item.datetime">
                <p class="comment-content">{{item.content}}</p>
              </a-comment>
            </a-list-item>
          </a-list>
        </a-layout-content>
        <a-layout-footer>
          <a-comment>
            <div slot="content">
              <a-form-item>
                <a-textarea :rows="4" @change="handleChange" :value="value"></a-textarea>
              </a-form-item>
              <a-form-item class="button-wrap">
                <a-button
                  htmlType="submit"
                  :loading="submitting"
                  @click="handleSubmit"
                  type="primary"
                >发送</a-button>
              </a-form-item>
            </div>
          </a-comment>
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import moment from "moment";
import io from "socket.io-client";
import { urlWsHead } from "../config";
export default {
  data() {
    return {
      socket: null,
      moment,
      submitting: false,
      value: "",
      userList: [],
      uname: "",
      roomID: "",
      chatContentList: []
    };
  },
  mounted() {
    this.socket = io(urlWsHead);

    this.uname = this.$route.query.username;
    this.roomID = this.$route.query.id;

    if (this.uname) {
      this.socket.emit("login", { username: this.uname, room_id: this.roomID });
    }

    this.socket.on("loginSuccess", data => {
      console.log("loginSuccess", data);
      this.userList = data.userlist.map(user => {
        return { title: user.username };
      });
    });

    this.socket.on("add", data => {
      console.log("add", data);
      this.userList.push({
        title: data.username
      });
    });

    this.socket.on("receiveMessage", data => {
      this.chatContentList.push({
        author: data.username,
        avatar:
          "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        content: data.message,
        datetime: moment().fromNow()
      });
    });

    this.socket.on("sendMessageSuccess", () => {
      this.submitting = false;
      this.value = "";
    });

    this.socket.on("leave", name => {
      console.log("leave", name);
      if (name != null) {
        this.userList = this.userList.filter(user => {
          return user.title != name;
        });
      }
    });
  },
  methods: {
    handleChange(e) {
      this.value = e.target.value;
    },
    handleSubmit() {
      if (!this.value) {
        return;
      }

      this.submitting = true;

      this.socket.emit("sendMessage", {
        username: this.uname,
        message: this.value
      });
    }
  }
};
</script>

<style scoped>
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: #7dbcea;
  color: #fff;
}
#components-layout-demo-basic .ant-layout-header {
  display: flex;
  justify-content: space-between;
}
#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}
#components-layout-demo-basic .ant-layout-sider {
  background: #3ba0e9;
  color: #fff;
  line-height: 120px;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgba(16, 142, 233, 1);
  color: #fff;
  height: 460px;
  overflow-y: scroll;
  line-height: 120px;
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
.comment-content {
  max-width: 900px;
  word-wrap: break-word;
}
.button-wrap {
  text-align: right;
}
</style>