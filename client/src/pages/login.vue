<template>
  <div style="width:100%;height:100%;">
    <div id="components-form-demo-normal-login">
      <a-form :form="form" @submit="handleSubmit" class="login-form">
        <a-form-item>
          <a-input
            v-decorator="[
          'userName',
          { rules: [{ required: true, message: 'Please input your username!' }] }
        ]"
            placeholder="Username"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] }
        ]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          }
        ]"
          >Remember me</a-checkbox>
          <a class="login-form-forgot" href>Forgot password</a>
          <a-button type="primary" html-type="submit" class="login-form-button">Log in</a-button>Or
          <a href>register now!</a>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import axios from "axios";
import { urlHead } from "../config";
export default {
  data() {
    return {};
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          let sendData = {
            username: values.userName,
            password: values.password
          };
          axios.post(urlHead + "/login", sendData).then(res => {
            console.log(res);
            if (res.data.success) {
              this.$router.push({
                path: "room",
                query: { username: values.userName }
              });
            } else {
              alert('登录失败！');
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
#components-form-demo-normal-login {
  margin: auto;
  width: max-content;
  border: 1px rgb(204, 204, 204) solid;
  padding: 20px;
  border-radius: 5px;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 40%;
  left: 50%;
  background: #fff;
}
#components-form-demo-normal-login .login-form {
  width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>