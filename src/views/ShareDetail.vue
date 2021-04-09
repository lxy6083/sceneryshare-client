<template>
  <div class="share-detail">
    <div class="rate">
      <span>评分</span>
      <el-rate
          v-model="rate"
          @change="mark"
          show-text
          :texts="['极差', '失望', '一般', '满意', '惊喜']"
          style="display: inline-block; margin-left: 20px; margin-right: 50px"/>
      <span>平均评分</span>
      <el-rate
          v-if="share.avgScore > 0"
          style="display: inline-block; margin-left: 20px; margin-right: 50px"
          v-model="share.avgScore"
          disabled
          show-score
          text-color="#ff9900"
          score-template="{value}">
      </el-rate>
      <el-rate
          v-else
          style="display: inline-block; margin-left: 20px; margin-right: 50px"
          disabled
          show-score
          text-color="#ff9900"
          score-template="未评分">
      </el-rate>
    </div>
    <div class="share">
      <div class="essence">
        <div class="triangle"></div>
        <div class="text">精</div>
      </div>
      <div class="avatar" v-if="share.user && share.user.avatar">
        <img :src="getUrl(share.user.avatar)">
      </div>
      <div class="body">
        <div class="name-time">
          <div class="username" v-if="share.user && share.user.username">
            {{share.user.username}}
          </div>
          <div class="createTime">
            {{share.createTime}}
          </div>
        </div>
        <div class="title" >
          {{share.title}}
        </div>
        <div class="content" v-html="share.content">
        </div>
        <div v-if="share.pic">
          <div class="pic" v-if="share.pic.toLowerCase().endsWith('jpg')||share.pic.toLowerCase().endsWith('jpeg')||share.pic.toLowerCase().endsWith('png')||share.pic.toLowerCase().endsWith('gif')">
            <el-image :src="getUrl(share.pic)" :preview-src-list="[getUrl(share.pic)]" style="width:100%" />
          </div>
          <div class="pic" v-if="share.pic.toLowerCase().endsWith('mp4')">
            <video :src="getUrl(share.pic)" style="width:100%" @click="playVideo(share.pic)"/>
          </div>
        </div>
        <div class="status-info">
          <span>天气：{{changeWeather(share.weather)}}</span>
          <span>时段：{{changeTimeBucket(share.timeBucket)}}</span>
          <span>季节：{{changeSeason(share.season)}}</span>
          <span>朝向：{{changeBearing(share.bearing)}}</span>
        </div>
        <div class="footer">
          <div class="collect footer-item">
            <div class="el-icon-collection-tag" v-if="share.isCollect === true" @click="cancelCollect(share.id)">
              <span>已收藏</span>
            </div>
            <div class="el-icon-collection-tag" v-else @click="collect(share.id)">
              <span>未收藏</span>
            </div>
          </div>
          <div class="comment el-icon-s-comment footer-item">
            <span>{{share.commentNum}}</span>
          </div>
          <div class="rank footer-item el-icon-star-off" v-if="share.avgScore !== 0">
            <span>{{share.avgScore}}</span>
          </div>
          <div class="rank footer-item el-icon-star-off" v-else>
            <span>暂无评分</span>
          </div>
        </div>
      </div>
    </div>
    <!--    评论区域-->
    <div class="comment-area">
      <div class="submit-comment">
        <div class="avatar">
          <img :src="getUrl(avatar)">
        </div>
        <div class="comment-textarea">
          <el-input
              type="textarea"
              resize="none"
              :rows="2"
              placeholder="请输入内容"
              v-model="comment">
          </el-input>
          <el-button type="primary" circle size="max" @click="submitComment">发表评论</el-button>
        </div>
      </div>
      <div class="comments">
        <div class="comment">
          <div class="name-time">
            <div class="username" v-if="share.user && share.user.username">
              {{share.user.username}}
            </div>
            <div class="createTime">
              {{share.createTime}}
            </div>
          </div>
          <div class="comment-text">

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
import {mapGetters} from 'vuex';
import {
  cancelCollect, collect,
  getAllCollect, getAvgScore,
  getByPrimaryKey, getComments,
  getScore,
  getScoreNum,
  getScoreSum,
  getShareByPrimaryKey,
  isCollect, mark
} from "../api";
export default {
  name: "ShareDetail",
  mixins: [mixin],
  data() {
    return {
      id: '',               //动态id
      share: {},            //动态
      comments: [],         //评论列表
      rate: 0,              //评分
      comment: '',          //评论
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
    this.id = this.$route.query.id;
    this.getData();
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
    //获取数据
    getData() {
      getShareByPrimaryKey(this.id)
      .then(res => {
        this.share = res;
        this.isCollect();
        this.getScore();
        this.getUserInfo();
        this.getComments();
        this.getAverageScore();
      })
      .catch(err => {
        console.log(err);
      })
    },
    //是否收藏
    isCollect() {
      isCollect(this.id,this.userId)
      .then(res => {
        this.$set(this.share,'isCollect',res);
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取用户的评分
    getScore() {
      getScore(this.id, this.userId)
      .then(res => {
        this.$set(this.share,'score',res);
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取平均评分
    getAverageScore() {
      getAvgScore(this.id)
      .then(res => {
        this.$set(this.share,'avgScore',res);
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取用户信息
    getUserInfo() {
      getByPrimaryKey(this.share.userId)
      .then(res => {
        this.$set(this.share,'user',res);
      })
      .catch(err => {
        console.log(err);
      })
    },
    //取消收藏
    cancelCollect(id) {
      cancelCollect(this.userId,id)
          .then(res => {
            if (res === true) {
              this.notify('已取消收藏','success');
              this.getData();
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
            } else {
              this.notify(res.msg,'error');
            }
          })
          .catch(err => {
            console.log(err);
          })
    },
    //获取评论信息
    getComments() {
      getComments(this.id)
        .then(res => {
          if (res === null) {
            this.$set(this.share,'commentNum',0);
          } else {
            this.$set(this.share,'commentNum',res.length);
            this.comments = res;
            this.getCommentsUserInfo();
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    //获取评论的用户信息
    getCommentsUserInfo() {
      this.comments.forEach(item => {
        getByPrimaryKey(item.userId)
        .then(res => {
          this.$set(item,'user',res);
          console.log(this.comments);
        })
        .catch(err => {
          console.log(err);
        })
      })
    },
    //评分
    mark() {
      let params = new URLSearchParams();
      params.append('sceneryshareId',this.id);
      params.append('userId',this.userId);
      params.append('score',this.rate);
      mark(params)
      .then(res => {
        if (res.code === 1) {
          this.notify(res.msg,'success');
        } else {
          this.notify(res.msg,'error');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },

  },
  computed: {
    ...mapGetters([
        'userId',
        'avatar',
        'username'
    ])
  }
}
</script>

<style scoped>
  .rate {
    position: relative;
    left: 50%;
    transform: translate(-50%,0);
    padding: 30px 20px;
    background-color: #ffffff;
    margin-top: 20px;
    width: 800px;
  }
  .share {
    position: relative;
    left: 50%;
    transform: translate(-50%,0);
    padding: 30px 20px;
    background-color: #ffffff;
    margin-top: 20px;
    width: 800px;
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

  .status-info {
    margin-top: 10px;
  }

  .status-info span {
    font-size: 12px;
    color: #aaaaaa;
    display: inline-block;
    margin-right: 10px;
  }
</style>