<template>
  <div>
    <div class="function">
      功能区域
    </div>
    <div class="all-share" v-for="item in myCollects">
      <div class="share">
        <div class="essence" v-if="item.essence === 1">
          <div class="triangle"></div>
          <div class="text">精</div>
        </div>
        <div class="avatar" v-if="item.user && item.user.avatar">
          <img :src="getUrl(item.user.avatar)">
        </div>
        <div class="body">
          <div class="name-time">
            <div class="username" v-if="item.user && item.user.username">
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
              <div class="el-icon-collection-tag" @click="cancelCollect(item.id)">
                <span>已收藏</span>
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
    <!-- 视频弹框区域 -->
    <el-dialog title="视频播放" :visible.sync="videoVisible" width="800px"  @close="closePlay" center>
      <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
          @play=" onPlayerPlay($event)"
          @pause=" onPlayerPause($event)"
          @statechanged=" playerStateChanged($event)"
      ></video-player>
    </el-dialog>
  </div>
</template>

<script>
import {mixin} from "../mixins";
import {
  cancelCollect,
  getAllCollect,
  getByPrimaryKey,
  getComments,
  getScoreNum,
  getScoreSum,
  getShareByPrimaryKey
} from "../api";
import {mapGetters} from 'vuex';
import {get} from "../api/http";

export default {
  mixins: [mixin],
  data() {
    return {
      myCollects: [],   //收藏列表详情
      collects: [],     //收藏列表
      videoVisible: false,  //视频播放弹框是否可见
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: 'video/mp4', //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: this.url //url地址
          }
        ],
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      },
    }
  },
  created() {
    this.getAllCollect();
  },
  mounted() {
    this.getAverageScore();
  },
  methods: {
    //根据相对路径获取绝对路径
    getUrl(url) {
      return `${this.$store.state.configure.HOST}/${url}`;
    },
    //播放视频
    playVideo(url) {
      if(url.endsWith('mp4')) {
        this.$store.commit('setUrl',this.$store.state.configure.HOST+ '/' + url);
        this.playerOptions.sources[0].src = this.url;
        this.videoVisible = true;
      }else {
        return false;
      }
    },
    //关闭弹框时关闭视频
    closePlay() {
      console.log('close');
      this.$refs.videoPlayer.player.pause();
    },
    onPlayerPlay ( player) {
    },
    onPlayerPause ( player) {
    },
    playerStateChanged ( player) {
    },
    //获取收藏列表
    getAllCollect() {
      getAllCollect(this.userId)
          .then(res => {
            this.collects = res;
            this.getData();
          })
          .catch(err => {
            console.log(err);
          })
    },
    //获取数据
    getData() {
      this.collects.forEach(item => {
        getShareByPrimaryKey(item.sceneryshareId)
        .then(res => {
          this.myCollects.push(res);
          this.getAverageScore(res);
          this.getComments(res);
          this.getUserInfo(res);
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
              this.getAllCollect();
            } else {
              this.notify('取消收藏失败','error');
            }
          })
          .catch(err => {
            console.log(err);
          })
    },
    //获取评分
    getAverageScore(item) {
      getScoreNum(item.id)
          .then(res => {
            this.$set(item, 'scoreNum', res);
          })
          .catch(err => {
            console.log(err)
          })
      getScoreSum(item.id)
          .then(res => {
            this.$set(item, 'scoreSum', res);
          })
          .catch(err => {
            console.log(err);
          })
    },
    //获取评论信息
    getComments(item) {
      getComments(item.id)
          .then(res => {
            if (res === null) {
              this.$set(item, 'commentNum', 0);
            } else {
              this.$set(item, 'commentNum', res.length);
            }
          })
          .catch(err => {
            console.log(err);
          })
    },
    //获取用户信息
    getUserInfo(item) {
        getByPrimaryKey(item.userId)
            .then(res => {
              this.$set(item,'user',res);
            })
            .catch(err => {
              console.log(err);
            })
    },
  },
  computed: {
    ...mapGetters([
      'userId',
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