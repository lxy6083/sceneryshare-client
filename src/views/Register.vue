<template>
	<!-- 注册容器 -->
	<div id="register_container">
    <div class="register_box">
      <span>用户注册</span>
      <el-divider></el-divider>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" :rules="registerRules" class="registerForm">
          <el-form-item prop="username" label="用户名" size="mini">
            <el-input v-model="registerForm.username" placeholder="1-11位字符"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码" size="mini">
            <el-input type="password" v-model="registerForm.password" placeholder="以字母开头，长度在6~16之间，只能包含字母、数字和英文字符"></el-input>
          </el-form-item>
          <el-form-item prop="rePassword" label="确认密码" size="mini">
            <el-input type="password" v-model="registerForm.rePassword" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="sex" label="性别" size="mini" :rules="{required: true}">
            <el-radio-group v-model="registerForm.sex">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号" size="mini">
            <el-input v-model="registerForm.mobile" placeholder="11位以1开头的手机号"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" size="mini">
            <el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="birthday" label="生日" size="mini">
            <el-date-picker v-model="registerForm.birthday" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="所在地" size="mini" class="pro_ct_dis" :rules="{required: true}">
            <v-distpicker :province="registerForm.province" :city="registerForm.city" :area="registerForm.district" @province="onChangeProvince" @city="onChangeCity" @area="onChangeDistrict"></v-distpicker>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button size="mini" @click="goBack(-1)">取消</el-button>
          <el-button size="mini" type="primary" @click="submitForm('registerForm')">确定</el-button>
        </span>
      </div>
	</div>
</template>

<script>
import {mixin} from '../mixins'
import {setUser} from '../api/index'
export default {
    name: 'Register',
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
          if (this.registerForm.password !== this.registerForm.rePassword) {
            callback(new Error('确认密码与密码不一致'));
          }
          callback();
        }
      };
      var checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          var reg = /^1[0-9]{10}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号'));
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
        registerForm: {
          username: '',
          password: '',
          rePassword: '',
          sex: 0,
          mobile: '',
          email: '',
          birthday: '',
          province: '',
          city: '',
          district: '',
        },
        registerRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            { min: 1, max: 11, message: '字符长度在1-11之间', trigger: 'blur'}
          ],
          password: [{required: true, validator: checkPassword, trigger: 'blur'}],
          rePassword: [{required: true, validator: checkRePassword, trigger: 'blur'}],
          mobile: [{required: true, validator: checkMobile, trigger: 'blur'}],
          email: [{required: true, validator: checkEmail, trigger: 'blur'}]
        }
      };
    },
    methods: {
      //用户注册
      register() {
        let _this = this;
        let d = this.registerForm.birthday;
        let dateTime = d === '' ? new Date.now() : d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let params = new URLSearchParams();
        params.append('username',this.registerForm.username);
        params.append('password',this.registerForm.password);
        params.append('sex',this.registerForm.sex);
        params.append('mobile',this.registerForm.mobile);
        params.append('email',this.registerForm.email);
        params.append('birthday',dateTime);
        params.append('province',this.registerForm.province);
        params.append('city',this.registerForm.city);
        params.append('district',this.registerForm.district);
        params.append('avatar','/avatarImages/defaultAvatar.jpg');
        setUser(params)
        .then(res => {
          if (res.code == 1) {
            this.notify('注册成功,2秒后自动跳转到登录页面', 'success');
            setTimeout(function() {
              _this.$router.push({path: '/login'});
            },2000);
          } else {
            this.notify(res.message, 'error');
          }
        })
        .catch(err => {
          this.notify(err.message, 'error');
        })
      },
      onChangeProvince(data) {
        this.registerForm.province = data.value;
      },
      onChangeCity(data) {
        this.registerForm.city = data.value;
      },
      onChangeDistrict(data) {
        this.registerForm.district = data.value;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid && this.registerForm.district !== '') {
              this.register();
            } else if(this.registerForm.district === '') {
              this.notify('请选择所在地区','error');
            }
        });
      },
      //返回
      goBack(index) {
        this.$router.go(index);
      }
    }
  };
</script>

<style scoped>
.register_box > span {
    display: block;
    text-align: center;
    margin-top: 20px;
    font-size: 20px;
}

#register_container {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #41b883;
}

.register_box {
	width: 600px;
	height: 100%;
	background-color: white;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.registerForm {
  margin-top: 30px;
  width: 90%;
}

.el-button {
  width: 120px;
  margin: 30px 80px;
}

.el-form-item {
  margin: 30px 0;
}
</style>