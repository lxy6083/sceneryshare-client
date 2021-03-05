//左侧导航栏
const navMsg = [
  {name: '首页',path: '/home'},
  {name: '动态',path: '/share'},
  {name: '我的动态',path: '/my-share'},
  {name: '我的收藏',path: '/my-collection'}
]

//右侧导航栏
const loginMsg = [
  {name: '登录', path: '/login'},
  {name: '注册', path: '/register'}
]

//下拉菜单
const menuList = [
  {name: '信息修改', path: '/updateUser'},
  {name: '意见反馈', path: '/feedback'},
  {name: '退出', path: 0},
  {name: '注销', path: -1}
]

export {
  navMsg,
  loginMsg,
  menuList
}