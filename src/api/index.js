import {get, post } from './http';

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



