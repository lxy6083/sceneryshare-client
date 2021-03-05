<template>
  <div class="recover-pwd">
    <el-form ref="form" :model="form" label-width="160px" :rules="formRules">
      <el-form-item
          prop="username"
          label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item
          prop="email"
          label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item
          prop="password"
          label="新密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item
          prop="rePassword"
          label="重复新密码">
        <el-input v-model="form.rePassword" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">修改密码</el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {mixin} from "../mixins";
import {recoverPwd} from "../api";

export default {
  mixins: [mixin],
  data() {
    var checkPassword = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('密码不能为空'));
      } else {
        if (value.length < 6 || value.length > 16) {
          callback(new Error('密码长度在6-16位之间'));
        }
        var reg = /^[a-zA-Z][a-zA-Z0-9_.@~!?]{5,15}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入有效的密码'));
        }
        callback();
      }
    };
    var checkRePassword = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('确认密码不能为空'));
      } else {
        if (this.form.password !== this.form.rePassword) {
          callback(new Error('确认密码与密码不一致'));
        }
        callback();
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'));
      } else {
        var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'));
        }
        callback();
      }
    };
    return {
      form: {
        username: '',
        email: '',
        password: '',
        rePassword: ''
      },
      formRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 1, max: 11, message: '字符长度在1-11之间', trigger: 'blur'}
        ],
        password: [{required: true, validator: checkPassword, trigger: 'blur'}],
        rePassword: [{required: true, validator: checkRePassword, trigger: 'blur'}],
        email: [{required: true, validator: checkEmail, trigger: 'blur'}]
      }
    }
  },
  methods: {
    recoverPwd() {
      let params = new URLSearchParams();
      params.append('username', this.form.username);
      params.append('email', this.form.email);
      params.append('password',this.form.password);
      recoverPwd(params)
      .then(res => {
        if (res.code == 1) {
          this.notify('密码修改成功','success');
        } else {
          this.notify(res.msg,'error')
        }
      })
      .catch(err => {
        this.notify(err.msg, 'error');
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.recoverPwd();
        }
      });
    },
    onCancel() {
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
  .recover-pwd {
    position: absolute;
    top: 120px;
    left: 45%;
    transform: translate(-50%,0);
  }
</style>