import {get, post } from './http';
import user from "../store/user";
import {sceneryType} from "../assets/js/options";

/* =======================用户相关函数====================== */
//判断用户是否登录成功
export const getLoginStatus = (params) => post(`user/login`, params);

//用户注册
export const setUser = (params) => post(`/user/add`, params);

//找回密码
export const recoverPwd = (params) => post(`/user/recoverPwd`, params);

//修改信息
export const updateUser = (params) => post(`/user/update`, params);

//注销用户
export const deleteUser = (userId) => get(`/user/delete?id=${userId}`);

//通过主键查找用户信息
export const getByPrimaryKey = (userId) => get(`/user/getByPrimaryKey?id=${userId}`);

/* =======================意见反馈相关函数====================== */
//发送建议
export const sendFeedback = (params) => post(`/feedback/send`, params);

//删除已发送的建议
export const deleteFeedback = (id) => get(`/feedback/delete?id=${id}`);

//获取该用户的建议信息
export const getAllFeedback = (id) => get(`/feedback/getFeedbackByUserId?id=${id}`);

/* =======================管理员相关函数====================== */



/* =======================景点相关函数====================== */
//添加景点
export const addScenery = (params) => post(`/scenery/add`, params);

//获取一级景点
export const getFirstScenery = () => get(`/scenery/getFirstScenery`);

//获取二级景点
export const getSecondScenery = () => get(`/scenery/getSecondScenery`);

//通过景点id获取景点信息
export const getSceneryByPrimaryKey = (id) => get(`/scenery/getByPrimaryKey?id=${id}`);


/* =======================动态相关函数====================== */

//通过用户id获取动态列表
export const getShareByUserId = (userId) => get(`/sceneryshare/user/scenery?userId=${userId}`);

//通过动态id获取动态详情
export const getShareByPrimaryKey = (id) => get(`/sceneryshare/getByPrimaryKey?id=${id}`);

//获取所有动态
export const getAllShare = () => get(`/sceneryshare/getAllSceneryShare`);

/* =======================评分相关函数====================== */

//获取总评分
export const getScoreSum = (sceneryshareId) => get(`/rank/getScoreSum?sceneryshareId=${sceneryshareId}`);

//获取总评分人数
export const getScoreNum = (sceneryshareId) => get(`/rank/getScoreNum?sceneryshareId=${sceneryshareId}`);

/* =======================收藏相关函数====================== */

//通过用户id获取收藏列表
export const getAllCollect = (userId) => get(`/collect/getAllCollect?userId=${userId}`);

//收藏
export const collect = (params) => post(`/collect/insert`, params);

//取消收藏
export const cancelCollect = (userId,sceneryshareId) => get(`/collect/delete?userId=${userId}&sceneryshareId=${sceneryshareId}`);

/* =======================评论相关函数====================== */

//通过动态id获取评论列表
export const getComments = (sceneryshareId) => get(`/comment/getBySceneryshareId?sceneryshareId=${sceneryshareId}`);
