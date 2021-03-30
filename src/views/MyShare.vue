<template>
  <div class="my-share">
    <div class="function">
      <el-button type="primary" @click="toAddShare">添加新动态</el-button>
    </div>
    <div class="all-share" v-for="item in myShare">
      <div class="share">
        <div class="essence" v-if="item.essence === 1">
          <div class="triangle"></div>
          <div class="text">精</div>
        </div>
        <div class="avatar">
          <img :src="getUrl(item.user.avatar)">
        </div>
        <div class="body">
          <div class="name-time">
            <div class="username">
              {{item.user.username}}
            </div>
            <div class="createTime">
              {{item.createTime}}
            </div>
          </div>
          <div class="title" >
            {{item.title}}
          </div>
          <div class="content" v-html="item.content">
          </div>
          <div class="pic" v-if="item.pic.toLowerCase().endsWith('jpg')||item.pic.toLowerCase().endsWith('jpeg')||item.pic.toLowerCase().endsWith('png')||item.pic.toLowerCase().endsWith('gif')">
            <el-image :src="getUrl(item.pic)" :preview-src-list="[getUrl(item.pic)]" style="width:100%" />
          </div>
          <div class="pic" v-if="item.pic.toLowerCase().endsWith('mp4')">
            <video :src="getUrl(item.pic)" style="width:100%" @click="playVideo(item.pic)"/>
          </div>
          <div class="footer">
            <div class="collect footer-item">
              <div class="el-icon-star-on" v-if="item.collect === 1">
                <span>已收藏</span>
              </div>
              <div class="el-icon-star-off" v-if="item.collect === 0">
                <span>未收藏</span>
              </div>
            </div>
            <div class="comment el-icon-s-comment footer-item">
              <span>{{item.commentCount}}</span>
            </div>
            <div class="rank footer-item">
              <span>{{'评分 ' + item.rank}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mixin} from "../mixins";
import {mapGetters} from 'vuex';
import {getByPrimaryKey, getSceneryByPrimaryKey, getShareByUserId} from "../api";

export default {
  mixins: [mixin],
  data() {
    return {
      myShare: []     //我的动态
    }
  },
  created() {
    this.getData();
  },
  methods: {
    //根据相对路径获取绝对路径
    getUrl(url) {
      return `${this.$store.state.configure.HOST}/${url}`;
    },
    //跳转到添加新动态页面
    toAddShare() {
      this.$router.push('/addShare');
    },
    //获取我的动态信息
    getData() {
      getShareByUserId(this.userId)
      .then(res => {
        console.log(res);
        for (let item of res) {
          if (item.visible === 1) {
            this.myShare.push(item);
          }
        }
        this.getUserInfo();
        this.getSceneryInfo();
        console.log(this.myShare);
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取用户信息
    getUserInfo() {
      this.myShare.forEach(item => {
        getByPrimaryKey(item.userId)
        .then(res => {
          this.$set(item,'user',res);
        })
        .catch(err => {
          console.log(err);
        })
      })
    },
    //获取景点信息
    getSceneryInfo() {
      this.myShare.forEach(item => {
        getSceneryByPrimaryKey(item.sceneryId)
        .then(res => {
          this.$set(item,'scenery',res);
        })
        .catch(err => {
          console.log(err);
        })
      })
    },
    //获取
  },
  computed: {
    ...mapGetters([
        'userId'
    ])
  }
}
</script>

<style scoped>
  .share {
    position: relative;
    left: 50%;
    transform: translate(-50%,0);
    padding: 30px 20px;
    background-color: #ffffff;
    margin-top: 10px;
    width: 800px;
    cursor: pointer;
  }

  .essence {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #fb7299;

  }

  .essence .triangle {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 50px solid lightgray;
    border-left: 50px solid transparent;
  }

  .essence .text {
    position: absolute;
    top: 6px;
    right: 6px;
  }

  .avatar {
    display: inline-block;
    vertical-align: top;
    margin-right: 20px;
  }

  .avatar img {
    border-radius: 50%;
    width: 60px;
    height: 60px;
    object-fit: cover;
    object-position: center;
  }

  .body {
    display: inline-block;
    width: 700px;
    vertical-align: top;
  }

  .body .name-time {
    margin: 10px 0;
  }

  .body .title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .body .name-time .username{
    color: #fb7299;
    font-size: 18px;
    margin-bottom: 5px;
  }

  .body .name-time .createTime {
    font-size: 12px;
    color: #aaaaaa;
  }

  .body .footer {
    margin-top: 10px;
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    color: #fb7299;
  }

  .body .footer .footer-item {
    display: inline-block;
    width: 20%;
    vertical-align: middle;
  }

  .body .footer span {
    font-size: 14px;
    color: #aaaaaa;
  }
</style>