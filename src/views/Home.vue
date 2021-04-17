<template>
  <div class="home">
    <baidu-map
        class="map"
        :center="center"
        :zoom="15"
        :scroll-wheel-zoom="true">
      <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="true"
          :autoLocation="true"
      ></bm-geolocation>
      <div class="marker" v-for="item in sceneryList">
        <bm-marker
            :position="{lng: item.lng, lat: item.lat}"
            @click="infoWindowOpen(item)"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE">
          <bm-info-window
              :show="item.show"
              @close="infoWindowClose(item)"
              @open="infoWindowOpen(item)">
            <p>景点名：{{item.name}}</p>
            <p>动态数：{{getShareNumBySceneryId(item.id)}}</p>
            <el-link type="primary" @click="toAllScenery(item.name)">立即查看</el-link>
          </bm-info-window>
        </bm-marker>
      </div>
    </baidu-map>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmScale from 'vue-baidu-map/components/controls/Scale'
import BmGeolocation from 'vue-baidu-map/components/controls/Geolocation'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation'
import BmMarkerClusterer from 'vue-baidu-map/components/extra/MarkerClusterer'
import BmMarker from 'vue-baidu-map/components/overlays/Marker'
import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow'
import {getAllScenery, getAllShare, getByPrimaryKey} from "../api";
import {mapGetters} from 'vuex'
export default {
  components: {
    BaiduMap,
    BmScale,
    BmGeolocation,
    BmNavigation,
    BmMarkerClusterer,
    BmMarker,
    BmInfoWindow
  },
  data() {
    return {
      sceneryList: [],    //景点列表
      center: '',
      show: false,
      shareList: []
    }
  },
  methods: {
    //获取用户信息
    getUserInfo() {
      let isLogin = JSON.parse(sessionStorage.getItem('isLogin'));
      if (isLogin === true) {
        getByPrimaryKey(this.userId)
        .then(res => {
          this.center = res.district.slice(0,res.district.length - 1);
        })
        .catch(err => {
          console.log(err)
        })
      } else {
        this.center = '北京';
      }
    },
    //获取所有的景点
    getAllScenery() {
      getAllScenery()
      .then(res => {
        this.sceneryList = res;
        for (let scenery of this.sceneryList) {
          this.$set(scenery,'lng',scenery.coordinate.split(',')[0]);
          this.$set(scenery,'lat',scenery.coordinate.split(',')[1]);
          this.$set(scenery,'show',false);
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    infoWindowClose (item) {
      item.show = false;
    },
    infoWindowOpen (item) {
      item.show = true;
    },
    //获取动态列表
    getAllShare() {
      this.shareList = [];
      getAllShare()
      .then(res => {
        for (let share of res) {
          if (share.visible === 1) {
            this.shareList.push(share);
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    //通过景点id获取动态数
    getShareNumBySceneryId(id) {
      let num = 0;
      for (let share of this.shareList) {
        if (share.sceneryId === id) {
          num++;
        }
      }
      return num;
    },
    //立即查看
    toAllScenery(id) {
      this.$router.push({
        path: '/share',
        query: {
          sceneryId: id
        }
      })
    }
  },
  created() {
    this.getAllScenery();
    this.getUserInfo();
    this.getAllShare();
  },
  computed: {
    ...mapGetters([
        'userId'
    ])
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}

.home .map {
  width: 100%;
  height: 100%;
}
</style>