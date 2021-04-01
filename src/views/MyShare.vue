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
              <div class="el-icon-collection-tag" v-if="isCollect(item.id) === true" @click="cancelCollect(item.id)">
                <span>已收藏</span>
              </div>
              <div class="el-icon-collection-tag" v-else @click="collect(item.id)">
                <span>未收藏</span>
              </div>
            </div>
            <div class="comment el-icon-s-comment footer-item">
              <span>{{item.commentNum}}</span>
            </div>
            <div class="rank footer-item" v-if="item.scoreNum !== 0">
              <span>{{'评分 ' + item.scoreSum / item.scoreNum}}</span>
            </div>
            <div class="rank footer-item el-icon-star-off" v-else>
              <span>暂无评分</span>
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
import {
  cancelCollect,
  collect,
  getAllCollect,
  getAverageScore,
  getByPrimaryKey, getComments,
  getSceneryByPrimaryKey,
  getScoreNum,
  getScoreSum,
  getShareByUserId
} from "../api";

export default {
  mixins: [mixin],
  data() {
    return {
      myShare: [],      //我的动态
      collects: [],     //收藏列表
    }
  },
  created() {
    this.getData();
    this.getAllCollect();
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
        for (let item of res) {
          if (item.visible === 1) {
            this.myShare.push(item);
          }
        }
        this.getUserInfo();
        this.getSceneryInfo();
        this.getAverageScore();
        this.getComments();
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
    //获取评分
    getAverageScore() {
      this.myShare.forEach(item => {
        getScoreNum(item.id)
        .then(res => {
          this.$set(item,'scoreNum',res);
        })
        .catch(err => {
          console.log(err)
        })
        getScoreSum(item.id)
        .then(res => {
          this.$set(item,'scoreSum',res);
        })
        .catch(err => {
          console.log(err);
        })
      })
    },
    //获取收藏列表
    getAllCollect() {
      getAllCollect(this.userId)
      .then(res => {
        this.collects = res;
      })
      .catch(err => {
        console.log(err);
      })
    },
    //判断收藏列表中有没有动态列表中的动态
    isCollect(sceneryshareId) {
      for (let item of this.collects) {
        if (item.sceneryshareId === sceneryshareId) {
          return true;
        }
      }
      return false;
    },
    //获取评论信息
    getComments() {
      this.myShare.forEach(item => {
        getComments(item.id)
        .then(res => {
          if (res === null) {
            this.$set(item,'commentNum',0);
          } else {
            this.$set(item,'commentNum',res.length);
          }
        })
        .catch(err => {
          console.log(err);
        })
      })
    },
    //取消收藏
    cancelCollect(id) {
      cancelCollect(this.userId,id)
      .then(res => {
        if (res === true) {
          this.notify('已取消收藏','success');
          this.getData();
          this.getAllCollect();
        } else {
          this.notify('取消收藏失败','error');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    //收藏
    collect(id) {
      let params = new URLSearchParams();
      params.append('userId',this.userId);
      params.append('sceneryshareId',id);
      collect(params)
      .then(res => {
        if (res.code === 1) {
          this.notify(res.msg,'success');
          this.getData();
          this.getAllCollect();
        } else {
          this.notify(res.msg,'error');
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
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
    vertical-align: middle;
  }

  .body .footer .footer-item {
    display: inline-block;
    width: 20%;
    vertical-align: middle;
    height: 30px;
    line-height: 30px;
  }

  .body .footer .footer-item span {
    display: inline-block;
    font-size: 14px;
    color: #aaaaaa;
    vertical-align: middle;
    height: 30px;
    line-height: 25px;
    padding-left: 5px;
  }


</style>