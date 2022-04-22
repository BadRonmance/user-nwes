/*
 * @Description: 文件介绍
 * @version: 1.0.0
 * @Author: 张泽锋
 * @Date: 2022-03-10 21:33:14
 * @LastEditTime: 2022-03-24 11:46:10
 * @LastEditors: 天生不是宠儿
 */
const develop = true;
// const url = 'https://testzs.sxydcyy.com'
// const url = "https://zs.sxydcyy.com";
// const accountInfo = wx.getAccountInfoSync();
// const env = accountInfo.miniProgram.envVersion;
let dev = {
  baseUrl: "https://ywapi.leecs.cn",
  MiniProgramAppId: "wx855361a721050c6b",
};
let pro = {
  baseUrl: "https://zs.sxydcyy.com",
  MiniProgramAppId: "wxa1439f77c6d06a15",
};

export const baseUrl = () => {
  return develop ? dev.baseUrl : pro.baseUrl;
};
export const AppId = () => {
  return develop ? dev.MiniProgramAppId : pro.MiniProgramAppId;
};
