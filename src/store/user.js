export default {
  state: {
    userId: '',         //用户ID
    username: '',       //用户账号
    avatar: '',         //用户头像
    center: '',         //地图坐标中心
  },
  getters: {
    userId: state => {
      let userId = state.userId;
      if(!userId) {
        userId = JSON.parse(window.sessionStorage.getItem('userId')) ;
      }
      return userId;
    },
    username: state => {
      let username = state.username;
      if(!username) {
        username = JSON.parse(window.sessionStorage.getItem('username')) ;
      }
      return username;
    },
    avatar: state => {
      let avatar = state.avatar;
      if(!avatar) {
        avatar = JSON.parse(window.sessionStorage.getItem('avatar')) ;
      }
      return avatar;
    },
    center: state => {
      let center = state.center;
      if(!center) {
        center = JSON.parse(window.sessionStorage.getItem('center')) ;
      }
      return center;
    }
  },
  mutations: {
    setUserId:(state,userId) => {
      state.userId = userId;
      window.sessionStorage.setItem('userId',JSON.stringify(userId));
    },
    setUsername:(state,username) => {
      state.username = username;
      window.sessionStorage.setItem('username',JSON.stringify(username));
    },
    setAvatar:(state,avatar) => {
      state.avatar = avatar;
      window.sessionStorage.setItem('avatar',JSON.stringify(avatar));
    },
    setCenter:(state,center) => {
      state.center = center;
      window.sessionStorage.setItem('center',JSON.stringify(center));
    }
  }
}