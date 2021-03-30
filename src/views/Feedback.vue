<template>
  <div class="feedback">
    <div class="feedback-box">
      <div class="editor">
        <quill-editor
            class="ql-snow"
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
        </quill-editor>
      </div>
      <el-button
          type="primary"
          @click="send"
          round>
        发送
      </el-button>
      <template v-if="feedbacks != null && feedbacks.length > 0">
        <div class="content" v-for="(item,index) in feedbacks">
          <span class="opinion" v-html="item.opinion"></span>
          <span class="time">{{'发送时间: ' + item.createTime}}</span>
          <el-divider></el-divider>
          <div v-if="item.feedback != null && item.feedback.length > 0">
            <span class="reply" v-html="item.feedback"></span>
            <span class="time">{{'回复时间: ' + item.updateTime}}</span>
          </div>
          <div v-if="item.feedback == null">
            暂无回复
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import {quillEditor} from 'vue-quill-editor'
import {mapGetters} from "vuex";
import {deleteFeedback, getAllFeedback, sendFeedback} from "../api";
import {mixin} from "../mixins";

export default {
  name: "Feedback",
  mixins: [mixin],
  components: {
    quillEditor
  },
  data() {
    return {
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
      content: '',
      feedbacks: [],
    }
  },
  created() {
    this.getData();
  },
  methods: {
    send() {
      if (this.content == '') {
        this.notify('请输入要发送的内容','error');
        return;
      }
      let params = new URLSearchParams();
      params.append('opinion', this.content);
      params.append('userId', this.userId);
      sendFeedback(params)
      .then(res => {
        if (res.code == 1) {
          this.notify(res.msg,'success');
          this.getData();
        } else {
          this.notify(res.msg,'error');
        }
      })
      .catch(err => {
        this.notify(err.msg,'error');
      })
    },
    getData() {
      getAllFeedback(this.userId)
      .then(res => {
        this.feedbacks = res;
      })
      .catch(err => {
        this.notify('获取建议列表出错','error');
      })
    },
    delete(id) {
      deleteFeedback(id)
      .then(res => {
        if (res) {
          this.notify('反馈删除成功','success');
        } else {
          this.notify('反馈删除失败', 'error');
        }
      })
      .catch(err => {
        this.notify('反馈删除失败', 'error');
      })
    },
    getAdminName(adminId) {

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

  .feedback {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .feedback-box {
    width: 600px;
    background-color: white;
    padding: 10px 20px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .content {
    margin-top: 10px;
    border: 1px solid #dcdfe6;
    padding: 10px;
  }

  .editor {
    height: 290px;
  }

  ::v-deep .pro_ct_dis .distpicker-address-wrapper select {
    padding-top: 0;
    padding-bottom: 0;
    font-size: 12px;
    outline: none;
    width: 32%;
    height: 30px;
  }

  ::v-deep .feedback-box .el-button {
    margin-bottom: 20px;
  }

  ::v-deep .feedback-box .quill-editor {
    height: 200px;
  }

  .time {
    font-size: 12px;
    color: #aaaaaa;
  }
</style>