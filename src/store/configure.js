export default {
  state: {
    HOST: 'http://127.0.01:8888', //后台访问地址根目录
    activePath: '',  //当前选中的菜单名
    isLogin: false,  //用户是否已登录
  },
  getters: {
    activePath: state => {
      let activePath = state.activePath;
      if(!activePath) {
        activePath = JSON.parse(window.sessionStorage.getItem('activePath')) ;
      }
      return activePath;
    },
    isLogin: state => {
      let isLogin = state.isLogin;
      if(!isLogin) {
        isLogin = JSON.parse(window.sessionStorage.getItem('isLogin')) ;
      }
      return isLogin;
    }
  },
  mutations: {
    setActivePath:(state,activePath) => {
      state.activePath = activePath;
      window.sessionStorage.setItem('activePath',JSON.stringify(activePath));
    },
    setIsLogin:(state,isLogin) => {
      state.isLogin = isLogin;
      window.sessionStorage.setItem('isLogin',JSON.stringify(isLogin));
    }
  }
}