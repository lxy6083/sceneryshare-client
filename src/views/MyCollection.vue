<template>
  <div>
    <div class="function">
      <div class="select">
        <el-input
            placeholder="请输入用户名、标题、或内容进行查找"
            style="width: 400px"
            size="mini"
            maxlength="20"
            show-word-limit
            v-model="selectWord">
        </el-input>
        <el-button
            size="mini"
            type="primary"
            @click="handleSelect"
            style="margin-left: 30px">
          查询
        </el-button>
      </div>
      <el-divider></el-divider>
      <div class="filtrate">
        <div class="filtrate-item">
          <span>所在地区</span>
          <v-distpicker
              :province="filtrateName.province"
              :city="filtrateName.city"
              :area="filtrateName.district"
              @province="onChangeProvince"
              @city="onChangeCity"
              @area="onChangeDistrict">
          </v-distpicker>
        </div>
        <div class="filtrate-item">
          <span>景点</span>
          <el-select v-model="filtrateName.scenery" placeholder="请选择" size="mini">
            <el-option
                v-for="item in sceneryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="filtrate-item">
          <span>天气</span>
          <el-select v-model="filtrateName.weather" placeholder="请选择" size="mini">
            <el-option
                v-for="item in weatherList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filtrate-item">
          <span>时段</span>
          <el-select v-model="filtrateName.timeBucket" placeholder="请选择" size="mini">
            <el-option
                v-for="item in timeBucketList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filtrate-item">
          <span>季节</span>
          <el-select v-model="filtrateName.season" placeholder="请选择" size="mini">
            <el-option
                v-for="item in seasonList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filtrate-item">
          <span>朝向</span>
          <el-select v-model="filtrateName.bearing" placeholder="请选择" size="mini">
            <el-option
                v-for="item in bearingList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" size="mini" @click="handleFiltrate">筛选</el-button>
      </div>
      <el-divider></el-divider>
      <div class="sort">
        <span>排序字段</span>
        <el-select
            style="margin-right: 30px"
            v-model="sort.sortName"
            placeholder="请选择排序字段"
            class="handle-select"
            size="mini"
            @change="handleSort">
          <el-option
              v-for="item in sortNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <span>排序方式</span>
        <el-select
            v-model="sort.sortType"
            placeholder="请选择排序方式"
            class="handle-select"
            size="mini"
            @change="handleSort">
          <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="all-share" v-for="item in showShare">
      <div class="share" @click="toShareDetail(item.id)">
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
          <div class="status-info">
            <span>天气：{{changeWeather(item.weather)}}</span>
            <span>时段：{{changeTimeBucket(item.timeBucket)}}</span>
            <span>季节：{{changeSeason(item.season)}}</span>
            <span>朝向：{{changeBearing(item.bearing)}}</span>
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
            <div class="rank footer-item el-icon-star-off" v-if="item.avgScore !== 0">
              <span>{{item.avgScore}}</span>
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
  getAllCollect, getAllScenery, getAvgScore,
  getByPrimaryKey, getCollectNum,
  getComments,
  getScoreNum,
  getScoreSum,
  getShareByPrimaryKey
} from "../api";
import {mapGetters} from 'vuex';
import {get} from "../api/http";
import {bearing, season, timeBucket, weather} from "../assets/js/options";

export default {
  mixins: [mixin],
  data() {
    return {
      myCollects: [],   //收藏列表详情
      collects: [],     //收藏列表
      selectShare: [],    //通过关键字筛选之后的动态
      filtrateShare: [],  //字段筛选动态
      sortShare: [],      //排序之后的动态
      showShare: [],      //显示的动态
      sort: {
        sortName: '',     //排序字段
        sortType: '',     //排序方法
      },
      sceneryList: [],  //景点列表
      weatherList: [],  //季节列表
      timeBucketList: [],  //时段列表
      seasonList: [],     //季节列表
      bearingList: [],        //朝向列表
      isEssence: [          //是否精华
        {
          value: 1,
          label: '是'
        },
        {
          value: 0,
          label: '否'
        },
      ],
      filtrateName: {       //筛选字段
        province: '',   //省
        city: '',       //市
        district: '',   //区
        scenery: '',    //景点
        weather: '',    //天气
        timeBucket: '', //时段
        season: '',     //季节
        bearing: '',    //朝向
        essence: ''     //精华
      },
      sortNameOptions: [
        {
          value: 'username',
          label: '用户名'
        },
        {
          value: 'createTime',
          label: '创建时间'
        },
        {
          value: 'commentNum',
          label: '评论数'
        },
        {
          value: 'collectNum',
          label: '收藏数'
        },
        {
          value: 'avgScore',
          label: '平均评分'
        }
      ],
      typeOptions: [
        {
          value: 'up',
          label: '升序',
        },
        {
          value: 'down',
          label: '降序',
        }
      ],
      selectWord: '',       //筛选关键词
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
    this.weatherList = weather;
    this.timeBucketList = timeBucket;
    this.seasonList = season;
    this.bearingList = bearing;
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
    //初始化所有动态数组
    initShareArray() {
      this.selectShare = this.myCollects;
      this.filtrateShare = this.myCollects;
      this.sortShare = this.myCollects;
      this.showShare = this.myCollects;
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
          this.getCollectNum(res);
        })
        .catch(err => {
          console.log(err);
        })
      })
      this.initShareArray();
    },
    //获取景点列表
    getAllScenery() {
      getAllScenery()
          .then(res => {
            for (let item of res) {
              if (item.flag === 1) {
                this.sceneryList.push(item);
              }
            }
            console.log(this.sceneryList);
          })
    },
    //获取收藏数
    getCollectNum(item) {
      getCollectNum(item.id)
          .then(res => {
            this.$set(item,'collectNum',res);
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
              this.getAllCollect();
            } else {
              this.notify('取消收藏失败','error');
            }
          })
          .catch(err => {
            console.log(err);
          })
    },
    //获取平均评分
    getAverageScore() {
      this.collects.forEach(item => {
        getAvgScore(item.id)
            .then(res => {
              this.$set(item,'avgScore',res);
            })
            .catch(err => {
              console.log(err);
            })
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
    //查看详细信息
    toShareDetail(id) {
      this.$router.push({
        path: `/shareDetail`,
        query: {
          id: id
        }
      })
    },
    //查找
    handleSelect() {
      if (this.selectWord === '') {
        this.showShare = this.myCollects;
        this.selectShare = this.myCollects;
      } else {
        this.showShare = this.myCollects.filter(value => {
          return value.title.includes(this.selectWord)
              || value.content.includes(this.selectWord)
              || value.user.username.includes(this.selectWord);
        })
        this.selectShare = this.myCollects;
      }
    },
    onChangeProvince(data) {
      this.filtrateName.province = data.value;
      console.log(data.value);
    },
    onChangeCity(data) {
      this.filtrateName.city = data.value;
      console.log(data.value);
    },
    onChangeDistrict(data) {
      this.filtrateName.district = data.value;
      console.log(data.value);
    },
    //筛选
    handleFiltrate() {
      if (this.sort.sortName !== '' && this.sort.sortType !== '') {
        this.filtrateShare = this.showShare;
      } else {
        this.filtrateShare = this.selectShare;
      }
      if (this.filtrateName.province !== '省' && this.filtrateName.province !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.scenery.province === this.filtrateName.province;
        })
      }
      if (this.filtrateName.city !== '市' && this.filtrateName.city !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.scenery.city === this.filtrateName.city;
        })
      }
      if (this.filtrateName.district !== '区' && this.filtrateName.city !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.scenery.district === this.filtrateName.district;
        })
      }
      if (this.filtrateName.scenery !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.scenery.name === this.filtrateName.scenery;
        })
      }
      if (this.filtrateName.weather !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.weather === this.filtrateName.weather;
        })
      }
      if (this.filtrateName.timeBucket !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.timeBucket === this.filtrateName.timeBucket;
        })
      }
      if (this.filtrateName.season !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.season === this.filtrateName.season;
        })
      }
      if (this.filtrateName.bearing !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.bearing === this.filtrateName.bearing;
        })
      }
      if (this.filtrateName.essence !== '') {
        this.filtrateShare = this.filtrateShare.filter(value => {
          return value.essence === this.filtrateName.essence;
        })
      }
      this.showShare = this.filtrateShare;
    },
    //排序
    handleSort() {
      this.sortShare = this.showShare;
      if (this.sort.sortName === 'username') {
        switch (this.sort.sortType) {
          case 'up':
            this.showShare = this.sortShare.sort(function (a, b) {
              return a.user.username < b.user.username ? -1 : a.user.username > b.user.username ? 1 : 0;
            })
            break;
          case 'down': this.showShare = this.sortShare.sort(function (a, b) {
            return a.user.username < b.user.username ? 1 : a.user.username > b.user.username ? -1 : 0;
          })
            break;
        }
      } else if (this.sort.sortName === 'createTime') {
        switch (this.sort.sortType) {
          case 'up': this.showShare = this.sortShare.sort(function (a, b) {
            return a.createTime < b.createTime ? -1 : a.createTime > b.createTime ? 1 : 0;
          })
            break;
          case 'down': this.showShare = this.sortShare.sort(function (a, b) {
            return a.createTime < b.createTime ? 1 : a.createTime > b.createTime ? -1 : 0;
          })
            break;
        }
      } else if (this.sort.sortName === 'commentNum') {
        switch (this.sort.sortType) {
          case 'up': this.showShare = this.sortShare.sort(function (a, b) {
            return a.commentNum - b.commentNum;
          })
            break;
          case 'down': this.showShare = this.sortShare.sort(function (a, b) {
            return b.commentNum - a.commentNum;
          })
            break;
        }
      } else if (this.sort.sortName === 'collectNum') {
        switch (this.sort.sortType) {
          case 'up': this.showShare = this.sortShare.sort(function (a, b) {
            return a.collectNum - b.collectNum;
          })
            break;
          case 'down': this.showShare = this.sortShare.sort(function (a, b) {
            return b.collectNum - a.collectNum;
          })
            break;
        }
      } else if (this.sort.sortName === 'avgScore') {
        switch (this.sort.sortType) {
          case 'up': this.showShare = this.sortShare.sort(function (a, b) {
            return a.avgScore - b.avgScore;
          })
            break;
          case 'down': this.showShare = this.sortShare.sort(function (a, b) {
            return b.avgScore - a.avgScore;
          })
            break;
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId',
    ])
  }
}
</script>

<style scoped lang="scss">
  .function {
    position: relative;
    left: 50%;
    transform: translate(-50%,0);
    padding: 30px 20px;
    background-color: #ffffff;
    margin-top: 10px;
    width: 800px;
    .filtrate {
      margin: 10px 0;
      .filtrate-item {
        display: inline-block;
        margin: 10px 20px;
        span {
          display: inline-block;
          margin: 0 10px;
          font-size: 14px;
        }
        ::v-deep .distpicker-address-wrapper {
          display: inline-block;
        }
        ::v-deep .distpicker-address-wrapper select {
          display: inline-block;
          padding: .25rem .75rem;
          height: 26px;
          font-size: .5rem;
        }
      }
    }
    .sort {
      span {
        display: inline-block;
        margin: 0 10px;
        font-size: 14px;
      }
    }
  }
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