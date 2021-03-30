<template>
 <div class="update-user">
   <div class="update_box">
     <span>用户信息修改</span>
     <el-divider></el-divider>
     <div id="user">
       <div class="avatar">
         <img :src="getUrl(avatar)">
       </div>
       <el-upload :action="uploadUrl(userId)" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
         <el-button size="mini" class="update-button">更新头像</el-button>
       </el-upload>
     </div>
     <el-form :model="updateForm" ref="updateForm" label-width="80px" :rules="updateRules" class="updateForm">
       <el-form-item prop="username" label="用户名" size="mini">
         <el-input v-model="updateForm.username" placeholder="1-11位字符"></el-input>
       </el-form-item>
       <el-form-item prop="sex" label="性别" size="mini" :rules="{required: true}">
         <el-radio-group v-model="updateForm.sex">
           <el-radio :label="0">女</el-radio>
           <el-radio :label="1">男</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item prop="mobile" label="手机号" size="mini">
         <el-input v-model="updateForm.mobile" placeholder="11位以1开头的手机号"></el-input>
       </el-form-item>
       <el-form-item prop="email" label="邮箱" size="mini">
         <el-input v-model="updateForm.email" placeholder="邮箱"></el-input>
       </el-form-item>
       <el-form-item prop="birthday" type="date" label="生日" size="mini">
         <el-date-picker v-model="updateForm.birthday" placeholder="选择日期"></el-date-picker>
       </el-form-item>
       <el-form-item label="所在地" size="mini" class="pro_ct_dis" :rules="{required: true}">
         <v-distpicker :province="updateForm.province" :city="updateForm.city" :area="updateForm.district" @province="onChangeProvince" @city="onChangeCity" @area="onChangeDistrict"></v-distpicker>
       </el-form-item>
     </el-form>
     <span slot="footer">
       <el-button size="mini" @click="goBack(-1)">取消</el-button>
       <el-button size="mini" type="primary" @click="submitForm('updateForm')">确定</el-button>
     </span>
   </div>
 </div>
</template>

<script>
import {mixin} from "../mixins";
import {getByPrimaryKey, updateUser} from "../api";
import {mapGetters} from 'vuex';

export default {
  name: "UpdateUser",
  mixins: [mixin],
  data() {
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
      updateForm: {
        username: '',
        sex: 0,
        password: '',
        mobile: '',
        email: '',
        birthday: '',
        province: '',
        city: '',
        district: '',
      },
      updateRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          { min: 1, max: 11, message: '字符长度在1-11之间', trigger: 'blur'}
        ],
        mobile: [{required: true, validator: checkMobile, trigger: 'blur'}],
        email: [{required: true, validator: checkEmail, trigger: 'blur'}]
      }
    }
  },
  created() {

  },
  methods: {
    //根据相对路径获取绝对路径
    getUrl(url) {
      return `${this.$store.state.configure.HOST}/${url}`;
    },
    getMsg(userId) {
      getByPrimaryKey(userId)
          .then(res => {
            this.updateForm.username = res.username;
            this.updateForm.sex = res.sex;
            this.updateForm.password = res.password;
            this.updateForm.mobile = res.mobile;
            this.updateForm.email = res.email;
            this.updateForm.birthday = res.birthday;
            this.updateForm.province = res.province;
            this.updateForm.city = res.city;
            this.updateForm.district = res.district;
          })
          .catch(err => {
            this.notify('未找到该用户信息','error');
          })
    },
    onChangeProvince(data) {
      this.updateForm.province = data.value;
    },
    onChangeCity(data) {
      this.updateForm.city = data.value;
    },
    onChangeDistrict(data) {
      this.updateForm.district = data.value;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.updateForm.district !== '') {
          this.update();
        } else if(this.updateForm.district === '') {
          this.notify('请选择所在地区','error');
        }
      });
    },
    update() {
      let d = new Date(this.updateForm.birthday);
      let dateTime = d === '' ? new Date.now() : d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      let params = new URLSearchParams();
      params.append('id',this.userId);
      params.append('username',this.updateForm.username);
      params.append('password',this.updateForm.password);
      params.append('sex',this.updateForm.sex);
      params.append('mobile',this.updateForm.mobile);
      params.append('email',this.updateForm.email);
      params.append('birthday',dateTime);
      params.append('province',this.updateForm.province);
      params.append('city',this.updateForm.city);
      params.append('district',this.updateForm.district);
      updateUser(params)
          .then(res => {
            if (res.code == 1) {
              this.$store.commit('setUsername',this.updateForm.username);
              this.notify('信息修改成功', 'success');
            } else {
              this.notify(res.msg, 'error');
            }
          })
          .catch(err => {
            this.notify(err.msg, 'error');
          })
    },
    //返回
    goBack(index) {
      this.$router.go(index);
    },
    //更新图片
    uploadUrl(id) {
      return `${this.$store.state.configure.HOST}/user/updateUserAvatar?id=${id}`;
    },
    //刷新信息
    getData() {
      getByPrimaryKey(this.userId)
      .then(res => {
        this.$store.commit('setAvatar', res.avatar);
      })
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'avatar',
    ])
  },
  mounted() {
    this.getMsg(this.userId);
  }
}
</script>

<style scoped>
  .update_box > span {
    position: relative;
    display: block;
    text-align: center;
    margin-top: 20px;
    font-size: 20px;
  }

  .update-user {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #41b883;
  }

  #user {
    width: 100px;
    margin-left: 250px;
    text-align: center;
  }

  .update-button {
    margin-top: 10px;
  }

  .update_box {
    width: 600px;
    height: 100%;
    background-color: white;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .updateForm {
    margin-top: 30px;
    width: 90%;
  }

  .avatar img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: center;
  }
</style>