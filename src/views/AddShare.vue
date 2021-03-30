<template>
  <div class="add-share">
<!--    添加动态表单-->
    <el-form :model="shareForm" ref="shareForm" label-width="120px" :rules="shareRules" class="shareForm">
      <el-form-item prop="title" label="标题" size="mini">
        <el-input v-model="shareForm.title"></el-input>
      </el-form-item>
      <el-form-item prop="content" label="内容" size="mini">
        <quill-editor
            class="ql-snow"
            v-model="shareForm.content"
            ref="myQuillEditor"
            :options="editorOption"
            @change="onEditorChange($event)">
        </quill-editor>
        <div style="text-align:right">
          {{TiLength}}/200
        </div>
      </el-form-item>
      <el-form-item prop="pic" label="照片/视频" size="mini">
        <el-upload
            class="upload-demo"
            ref="upload"
            :auto-upload=false
            :limit=1
            drag
            action="http://localhost:8888/sceneryshare/add"
            :data="shareForm"
            :before-upload="beforePicUpload"
            :on-success="handlePicSuccess"
            style="margin-left:80px;">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">这里只能上传一张,如需更换请先手动删除列表中的！</div>
        </el-upload>
      </el-form-item>
      <el-form-item prop="scenery" label="景点" size="mini">
        <el-select v-model="shareForm.firstScenery" filterable placeholder="请选择一级景点" style="margin-right: 10px">
          <el-option
              v-for="item in firstSceneryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="shareForm.secondScenery" filterable placeholder="请选择二级景点" style="margin-right: 10px">
          <el-option
              v-for="item in secondSceneryListFilted"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <el-button @click="firstDialogVisible = true">新增一级景点</el-button>
        <el-button @click="secondDialogVisible = true">新增二级景点</el-button>
      </el-form-item>
      <el-form-item prop="weather" label="天气" size="mini">
        <el-select v-model="shareForm.weather" placeholder="请选择天气">
          <el-option
              v-for="item in weather"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="timeBucket" label="时段" size="mini">
        <el-select v-model="shareForm.timeBucket" placeholder="请选择时段">
          <el-option
              v-for="item in timeBucket"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="season" label="季节" size="mini">
        <el-select v-model="shareForm.season" placeholder="请选择季节">
          <el-option
              v-for="item in season"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="bearing" label="朝向" size="mini">
        <el-select v-model="shareForm.bearing" placeholder="请选择朝向">
          <el-option
              v-for="item in bearing"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <!--    添加动态的提交取消按钮-->
      <el-form-item>
        <el-button size="mini" @click="$router.back()">取消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('shareForm')">确定</el-button>
      </el-form-item>
    </el-form>

    <!--    添加一级景点的dialog-->
    <el-dialog title="添加一级景点" :visible.sync="firstDialogVisible" :append-to-body="true">
      <el-form :model="firstSceneryForm" ref="firstSceneryForm" label-width="120px" :rules="firstSceneryRules" class="firstSceneryForm">
        <el-form-item label="选择地点">
          <div class="map">
            <baidu-map class="bmView" :scroll-wheel-zoom="true" :center="location" :zoom="zoom" @click="getLocationPoint">
              <bm-view style="width: 100%; height:300px; flex: 1; z-index: 1"></bm-view>
              <bm-control>
                <bm-auto-complete v-model="addressKeyword" :sugStyle="{zIndex: 99999999999}">
                  <el-input v-model="addressKeyword" placeholder="请搜索景点地址并点击地图上相应的标记点" style="width: 300px" ></el-input>
                  <bm-local-search :keyword="addressKeyword" :auto-viewport="true" style="display: none"></bm-local-search>
                </bm-auto-complete>
              </bm-control>
            </baidu-map>
          </div>
        </el-form-item>
        <el-form-item label="景点类型" prop="type">
          <el-select v-model="firstSceneryForm.type" placeholder="请选择景点类型">
            <el-option
                v-for="item in sceneryType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="景点名" prop="name">
          <el-input v-model="firstSceneryForm.name" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="经纬度坐标" prop="coordinate">
          <el-input v-model="firstSceneryForm.coordinate" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-input v-model="firstSceneryForm.province" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="firstSceneryForm.city" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="区" prop="district">
          <el-input v-model="firstSceneryForm.district" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitScenery('firstSceneryForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--    添加二级景点的dialog-->
    <el-dialog title="添加二级景点" :visible.sync="secondDialogVisible" :append-to-body="true">
      <el-form :model="secondSceneryForm" ref="secondSceneryForm" label-width="120px" :rules="secondSceneryRules" class="firstSceneryForm">
        <el-form-item label="选择地点">
          <div class="map">
            <baidu-map class="bmView" :scroll-wheel-zoom="true" :center="location" :zoom="zoom" @click="getLocationPoint1">
              <bm-view style="width: 100%; height:300px; flex: 1; z-index: 1"></bm-view>
              <bm-control>
                <bm-auto-complete v-model="addressKeyword1" :sugStyle="{zIndex: 99999999999}">
                  <el-input v-model="addressKeyword1" placeholder="请搜索景点地址并点击地图上相应的标记点" style="width: 300px" ></el-input>
                  <bm-local-search :keyword="addressKeyword1" :auto-viewport="true" style="display: none"></bm-local-search>
                </bm-auto-complete>
              </bm-control>
            </baidu-map>
          </div>
        </el-form-item>
        <el-form-item label="所属一级景点" prop="firstScenery">
          <el-select v-model="secondSceneryForm.parentId" placeholder="请选择景点类型">
            <el-option
                v-for="item in firstSceneryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="景点类型" prop="type">
          <el-select v-model="secondSceneryForm.type" placeholder="请选择景点类型">
            <el-option
                v-for="item in sceneryType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="景点名" prop="name">
          <el-input v-model="secondSceneryForm.name" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="经纬度坐标" prop="coordinate">
          <el-input v-model="secondSceneryForm.coordinate" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-input v-model="secondSceneryForm.province" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="市" prop="city">
          <el-input v-model="secondSceneryForm.city" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="区" prop="district">
          <el-input v-model="secondSceneryForm.district" :disabled="true" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitScenery('secondSceneryForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {mixin} from "../mixins";
import {mapGetters} from 'vuex';
import {quillEditor} from "vue-quill-editor";
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmView from 'vue-baidu-map/components/map/MapView.vue'
import BmLocalSearch from 'vue-baidu-map/components/search/LocalSearch.vue'
import BmAutoComplete from 'vue-baidu-map/components/others/AutoComplete'
import {sceneryType, weather, timeBucket, season, bearing} from "../assets/js/options";
import {addScenery, getFirstScenery, getSecondScenery} from "../api";
import {loginMsg} from "../assets/js/header";

export default {
  name: "AddShare",
  mixins: [mixin],
  components: {
    quillEditor,
    BaiduMap,
    BmView,
    BmLocalSearch,
    BmAutoComplete
  },
  created() {
    this.sceneryType = sceneryType;
    this.weather = weather;
    this.timeBucket = timeBucket;
    this.season = season;
    this.bearing = bearing;
    this.getFirstScenery();
    this.getSecondScenery();
  },
  mounted() {
    //数据初始化
    this.TiLength =this.$refs.myQuillEditor.quill.getLength() - 1;
  },
  data() {
    return {
      shareForm: {
        userId: '',
        title: '',
        district: '',
        firstScenery: '',
        secondScenery: '',
        sceneryId: '',
        weather: '',
        timeBucket: '',
        season: '',
        bearing: ''
      },
      firstSceneryForm: {
        name: '',
        type: '',
        coordinate: '',
        province: '',
        city: '',
        district: ''
      },
      secondSceneryForm: {
        name: '',
        type: '',
        coordinate: '',
        province: '',
        city: '',
        district: '',
        parentId: ''
      },
      weather: [],
      timeBucket: [],
      season: [],
      bearing: [],
      editorOption: {
        placeholder: '请输入内容', // 占位文字
        modules: {
          // 工具栏
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'],     //引用，代码块
            [{'header': 1}, {'header': 2}],        // 标题，键值对的形式；1、2表示字体大小
            [{'list': 'ordered'}, {'list': 'bullet'}],     //列表
            [{'script': 'sub'}, {'script': 'super'}],   // 上下标
            [{'indent': '-1'}, {'indent': '+1'}],     // 缩进
            [{'direction': 'rtl'}],             // 文本方向
            [{'size': ['small', false, 'large', 'huge']}], // 字体大小
            [{'header': [1, 2, 3, 4, 5, 6, false]}],     //几级标题
            [{'color': []}, {'background': []}],     // 字体颜色，字体背景颜色
            [{'font': []}],     //字体
            [{'align': []}],    //对齐方式
            ['clean'],    //清除字体样式
          ]
        }
      },
      hideUpload: false,
      firstDialogVisible: false,    //新增一级景点弹框是否可见
      secondDialogVisible: false,   //新增二级景点弹框是否可见
      shareRules: {                 //动态表单规则

      },
      firstSceneryRules: {               //一级景点表单规则
        name: { required: true , message: '请选择景点', trigger: 'change'},
        type: { required: true, message: '请选择景点类型', trigger: 'change'},
      },
      secondSceneryRules: {               //二级景点表单规则
        name: { required: true , message: '请选择景点', trigger: 'change'},
        type: { required: true, message: '请选择景点类型', trigger: 'change'},
        parentId: { required: true, message: '请选择所属的一级景点', trigger: 'change'}
      },
      sceneryType: [],
      location: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 6.8,
      addressKeyword: '',
      addressKeyword1: '',
      firstSceneryList: [],
      secondSceneryList: [],
      secondSceneryListFilted: [],    //监听firstSceneryList之后变化所得到的二级景点列表
      TiLength: 0,                    // 限制长度

    }
  },
  watch: {
    shareForm: {
      handler () {
        this.secondSceneryListFilted = [];
        this.secondSceneryList.forEach(item => {
          if (item.parentId === this.shareForm.firstScenery) {
            this.secondSceneryListFilted.push(item);
          }
        })
      },
      immediate: true,
      deep: true
    }

  },
  methods: {
    imgChange(file, fileList) {
      this.shareForm.pic = fileList;
      if (fileList) {
        this.$refs['uploadElement'].clearValidate();
      }
    },
    imgRemove() {

    },
    showFirstDialog() {
      this.firstDialogVisible = true;
    },
    //一级景点设置位置信息
    getLocationPoint(e) {
      this.lng = e.point.lng;
      this.lat = e.point.lat;
      /* 创建地址解析器的实例 */
      let geoCoder = new BMap.Geocoder();
      /* 获取位置对应的坐标 */
      geoCoder.getPoint(this.addressKeyword, point => {
        this.firstSceneryForm.coordinate = point.lng + ',' + point.lat;
      });
      /* 利用坐标获取地址的详细信息 */
      geoCoder.getLocation(e.point, res=>{
        this.firstSceneryForm.province = res.addressComponents.province;
        this.firstSceneryForm.city = res.addressComponents.city;
        this.firstSceneryForm.district = res.addressComponents.district;
      });
      this.firstSceneryForm.name = this.addressKeyword;
    },
    //二级景点设置位置信息
    getLocationPoint1(e) {
      this.lng = e.point.lng;
      this.lat = e.point.lat;
      /* 创建地址解析器的实例 */
      let geoCoder = new BMap.Geocoder();
      /* 获取位置对应的坐标 */
      geoCoder.getPoint(this.addressKeyword1, point => {
        this.secondSceneryForm.coordinate = point.lng + ',' + point.lat;
      });
      /* 利用坐标获取地址的详细信息 */
      geoCoder.getLocation(e.point, res=>{
        this.secondSceneryForm.province = res.addressComponents.province;
        this.secondSceneryForm.city = res.addressComponents.city;
        this.secondSceneryForm.district = res.addressComponents.district;
      });
      this.secondSceneryForm.name = this.addressKeyword1;
    },
    submitScenery(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'firstSceneryForm') {
            this.addScenery();
          } else {
            this.addScenery1();
          }
        } else {
          this.notify('请先完善景点信息', 'error');
        }
      });
    },
    addScenery() {
      let params = new URLSearchParams();
      params.append('name',this.firstSceneryForm.name);
      params.append('type',this.firstSceneryForm.type);
      params.append('coordinate',this.firstSceneryForm.coordinate);
      params.append('province',this.firstSceneryForm.province);
      params.append('city',this.firstSceneryForm.city);
      params.append('district',this.firstSceneryForm.district);
      addScenery(params)
      .then(res => {
        if (res.code === 1){
          this.notify(res.msg,'success');
          this.firstDialogVisible = false;
          this.getFirstScenery();
        } else {
          this.notify(res.msg, 'error');
        }
      })
      .catch(err => {
        this.notify('error', err);
      })
    },
    addScenery1() {
      let params = new URLSearchParams();
      params.append('name',this.secondSceneryForm.name);
      params.append('type',this.secondSceneryForm.type);
      params.append('coordinate',this.secondSceneryForm.coordinate);
      params.append('province',this.secondSceneryForm.province);
      params.append('city',this.secondSceneryForm.city);
      params.append('district',this.secondSceneryForm.district);
      params.append('parentId',this.secondSceneryForm.parentId);
      addScenery(params)
          .then(res => {
            if (res.code === 1){
              this.notify(res.msg,'success');
              this.secondDialogVisible = false;
              this.getSecondScenery();
            } else {
              this.notify(res.msg, 'error');
            }
          })
          .catch(err => {
            this.notify('error', err);
          })
    },
    //获取一级景点列表
    getFirstScenery() {
      getFirstScenery()
      .then(res => {
        this.firstSceneryList = res;
      })
      .catch(err => {
        console.log(err);
      })
    },
    //获取二级景点列表
    getSecondScenery() {
      getSecondScenery()
      .then(res => {
        this.secondSceneryList = res;
      })
      .catch(err => {
        console.log(err);
      })
    },
    //限制字数
    onEditorChange(event) {
      event.quill.deleteText(200,1);
      if(this.shareForm.content === ''){
        this.TiLength = 0
      }
      else{
        this.TiLength = event.quill.getLength()-1
      }
    },
    //上传表单以及图片
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.shareForm.secondScenery === '') {
            this.shareForm.sceneryId = this.shareForm.firstScenery;
          } else {
            this.shareForm.sceneryId = this.shareForm.secondScenery;
          }
          this.shareForm.userId = this.userId;
          this.$refs.upload.submit();
        } else {
          this.notify('请完善需要填写的信息','error');
        }
      });
    }
  },
  computed: {
    ...mapGetters([
        'userId',
    ])
  }
}
</script>

<style scoped>
  .add-share {
    width: 800px;
    background: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%,0);
  }

  .shareForm {
    margin-right: 40px;
  }

  ::v-deep .ql-blank,
  ::v-deep .ql-editor {
    height: 200px;
  }

  ::v-deep .hide .el-upload--picture-card {
    display: none;
  }

  .map {
    height: 300px;
    width: 100%;
  }
</style>