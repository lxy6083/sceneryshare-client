<template>
  <div class="the-header">
    <div class="header-logo" @click="goHome">
      <img src="../assets/img/logo.png" alt="">
    </div>
    <ul class="navbar">
      <li :class="{active: item.path === $route.path}" v-for="item in navMsg" :key="item.path" @click="goPage(item.path)">
        {{item.name}}
      </li>
    </ul>
    <ul class="navbar loginNav">
      <li v-show="!isLogin" :class="{active: item.path === $route.path}" v-for="item in loginMsg" :key="item.path" @click="goPage(item.path)">
        {{item.name}}
      </li>
    </ul>
    <div class="header-right" v-show="isLogin">
      <div id="user">
        <img :src="getUrl(avatar)">
      </div>
      <ul class="menu">
        <li
            v-for="(item,index) in menuList"
            :key="index"
            @click="handleMenu(item.path)">
          {{item.name}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {navMsg,loginMsg,menuList} from '../assets/js/header';
import {mapGetters} from 'vuex';
import {deleteUser} from "../api";

export default {
  name: 'the-header',
  data() {
    return {
      navMsg: [],     //左侧导航栏
      loginMsg: [],   //右侧导航栏
      menuList: [],   //下拉菜单
    }
  },
  created () {
    this.$store.commit('setActivePath', this.$route.path);
    this.navMsg = navMsg;
    this.loginMsg = loginMsg;
    this.menuList = menuList;
  },
  mounted() {
    document.querySelector('#user').addEventListener('mouseover',function (e) {
      document.querySelector('.menu').classList.add('show');
      e.stopPropagation();
    });
    document.querySelector('.menu').addEventListener('click', function (e) {
      e.stopPropagation();
    });
    document.addEventListener('click',function (e) {
      document.querySelector('.menu').classList.remove('show');
    });
  },
  methods: {
    //根据相对路径获取绝对路径
    getUrl(url) {
      return `${this.$store.state.configure.HOST}/${url}`;
    },
    goHome() {
      if (this.$route.path !== '/home') {
        this.$router.push({ path: '/home'});
      }
    },
    goPage(path) {
      if (this.$route.path !== path) {
        this.$store.commit('setActivePath', this.$route.path);
        this.$router.push({ path: path});
      }
    },
    handleMenu(path) {
      if (path == 0) {
        this.$store.commit('setIsLogin', false);
        this.$router.go(0);
        //退出
      } else if (path == -1) {
        //注销
        this.delete(this.userId);
      } else {
        //页面跳转
        this.$router.push({path: path});
      }
    },
    delete(userId) {
      this.$confirm('此操作将永久注销账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append('userId', userId);
        deleteUser(params)
            .then(res => {
              if (res.code == 1) {
                this.notify('用户注销成功', 'success');
              } else {
                this.notify(res.msg, 'error');
              }
            })
            .catch(err => {
              this.notify(err.msg, 'error');
            })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消注销操作'
        });
      });
    }
  },
  computed: {
    ...mapGetters([
      'activePath',
      'isLogin',
      'avatar',
      'userId'
    ])
  }
}
</script>

<style scoped>
  .the-header {
    height: 70px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px -2px 10px #000;
  }

  .header-logo {
    height: 70px;
    width: 70px;
    position: absolute;
    left: 100px;
    cursor: pointer;
  }

  .header-logo img {
    height: 70px;
  }

  .navbar {
    margin: 0;
    position: absolute;
    left: 200px;
    list-style: none;
    height: 70px;
    line-height: 70px;
  }

  .navbar li {
    float: left;
    padding: 0 10px;
    margin: 0 30px;
    color: #aaa;
    cursor: pointer;
  }

  .active {
    color: deepskyblue !important; 
    border: 0;
    border-bottom: 3px solid deepskyblue;
  }

  .loginNav {
    left: auto;
    right: 100px;
  }

  .header-right {
    position: absolute;
    right: 150px;
    height: 70px;
  }

  .header-right img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 60px;
    border-radius: 50%;
  }

  .menu {
    display: none;
    margin-top: 70px;
    width: 120px;
    background: white;
    list-style: none;
    margin-left: 0;
    padding: 0;
  }

  .menu li {
    text-align: center;
  }
  .show {
    display: block;
    position: absolute;
    left: 0;
    transform: translate(-50%,0);
    z-index: 20;
  }

  .menu li:hover {
    background: #f4f4f4;
  }
</style>