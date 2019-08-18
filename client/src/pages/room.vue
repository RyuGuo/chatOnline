<template>
  <div class="room-pick-wrap">
    <p>选择房间</p>
    <hr />
    <a-list class="demo-loadmore-list" itemLayout="horizontal" :dataSource="roomList">
      <a-list-item slot="renderItem" slot-scope="item">
        <router-link slot="actions" :to="{path:'/chatroom',query:{id:item.id,username:uname}}">进入</router-link>
        <!-- <a slot="actions" :href="'./room/'+item.name">进入</a> -->
        <a-list-item-meta :description="item.description">
          <a slot="title" href="#">{{item.name}}</a>
          <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </a-list-item-meta>
        <div>当前人数: {{item.member_num}}人</div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import axios from "axios";
import { urlHead } from "../config";
export default {
  data() {
    return {
      uname: "",
      roomList: []
    };
  },
  mounted() {
    this.uname = this.$route.query.username;
    axios.get(urlHead + "/roomlist").then(res => {
      this.roomList = res.data.roomlist;
    });
  },
  methods: {}
};
</script>

<style>
.demo-loadmore-list {
  min-height: 350px;
}
.room-pick-wrap {
  width: 900px;
  background: #fff;
  margin: auto;
}
.room-pick-wrap p {
  text-align: center;
  font-size: 30px;
}
</style>