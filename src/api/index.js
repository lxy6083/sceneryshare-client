import {get, post } from './http';
import user from "../store/user";

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
export const getShareByUserId = (userId) => get(`/sceneryshare/getSceneryByUserId?userId=${userId}`);

