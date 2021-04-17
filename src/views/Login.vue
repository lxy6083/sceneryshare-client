<template>
	<!-- 登录表单的容器 -->
	<div id="login_container">
		<!-- 登录区域 -->
		<div id="login_box">
			<!-- 头像模块 -->
			<div id="avatar_box">
				<img src="../assets/img/avatar.gif" alt="#" />
			</div>
			<!-- 表单模块 -->
			<el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login_form" >
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user-solid" ></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-view" ></el-input>
				</el-form-item>
				<el-form-item prop="verifyCode">
					<div id="verifyCode_box">
						<el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" prefix-icon="el-icon-mobile" 
            @keyup.enter.native="submitForm('loginForm')" id="verifyCodeInput" ></el-input>
						<!-- 验证码显示 -->
						<div id="v_container"></div>
					</div>
				</el-form-item>
				<el-form-item id="button_area">
					<el-button type="primary" @click="submitForm('loginForm')" class="login_btn" >登录</el-button>
					<el-button @click="resetForm('loginForm')" class="login_btn" >重置</el-button>
					<router-link :to="{ name: 'RecoverPwd' }">
						<el-link type="primary" id="RecoverPwd">找回密码</el-link>
					</router-link>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { GVerify } from "../assets/js/vericode";
import {mixin} from '../mixins'
import {getLoginStatus} from '../api/index'
export default {
	name: "Login",
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
      var checkVerifyCode = (rule, value, callback) => {
        if(!value) {
          return callback(new Error('验证码不能为空'));
        } else {
          if (value.length !== 4) {
            callback(new Error('请输入4位有效验证码'));
          }
          
          callback();
        }
      };
		return {
			loginForm: {
				username: "",
				password: "",
				verifyCode: "",
			},
			loginRules: {
				username: 
        [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 1, max: 11, message: '字符长度在1-11之间', trigger: 'blur'}
        ],
				password: [{ validator: checkPassword, trigger: "blur" }],
				verifyCode: 
        [
					{ required: true, message: "验证码不可为空", trigger: "blur" },
          { validator: checkVerifyCode, trigger: "blur" }
				],
			},
			verifyCode: null,
      //登录之后要跳转的路由
      route: '',
		};
	},
	mounted() {
		this.verifyCode = new GVerify("v_container");
	},
  created() {
	  this.route = this.$route.query.redirect;
  },
  methods: {
		submitForm(formName) {
			var that = this;
			// 获取验证码
			var verifyCode = this.loginForm.verifyCode;
			var verifyFlag = this.verifyCode.validate(verifyCode);
			if (!verifyFlag) {
				that.notify('验证码输入错误','error');
				return;
			}
			this.$refs[formName].validate((valid) => {
				if (valid && verifyCode) {
          let params = new URLSearchParams();
          params.append('username',this.loginForm.username);
          params.append('password',this.loginForm.password);
          getLoginStatus(params)
            .then(res => {
                if(res.code == 1) {
                  console.log(this.route);
                  sessionStorage.setItem('isLogin', true);
                  if (this.route === '/login' || this.route === undefined || this.route === '') {
                    this.$router.push('/home');
                  } else {
                    this.$router.push(this.route);
                  }
                  this.notify("登陆成功","success");
                  this.$store.commit('setIsLogin',true);
                  this.$store.commit('setUserId',res.userMsg.id);
                  this.$store.commit('setUsername',res.userMsg.username);
                  this.$store.commit('setAvatar',res.userMsg.avatar);

                }else {
                  this.notify(res.msg,"error");
                }
            });
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
	},
};
</script>

<style scoped>
#login_container {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: #41b883;
}

#login_box {
	width: 450px;
	height: 350px;
	background-color: white;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#avatar_box {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 150px;
	height: 150px;
	border-radius: 50%;
	border: 1px solid rgba(65, 184, 131, 0.5);
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

#avatar_box img {
	position: absolute;
	top: 0;
	left: 0;
	transform: translate(5%, 5%);
	width: 90%;
	border-radius: 50%;
	overflow: hidden;
}

.login_form {
	position: absolute;
	bottom: 0;
	left: 10%;
	width: 80%;
}

#verifyCode_box {
	width: 50%;
}

#v_container {
	position: absolute;
	right: 10%;
	top: 0;
}

#button_area {
	margin-left: 20px;
}

#RecoverPwd {
	position: absolute;
	right: 0;
}

.login_btn {
	margin-right: 20px;
}

.el-button {
  width: 120px;
}
</style>