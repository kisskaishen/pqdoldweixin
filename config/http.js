import {
    baseUrl
} from './env'
import md5Sign from './md5Sign'
import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = baseUrl
//设置默认请求头
axios.defaults.headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}
axios.defaults.transformResponse = [function (data) {
    // 对 data 进行任意转换处理
    // console.log(data);
    if (data.indexOf('(') == 0) {//返回有中括号的数据
        data = data.substr(1).substring(0, data.length - 2);
        // console.log(JSON.parse(data));
        return JSON.parse(data)
        return data;
    } else if (data.indexOf('<script') >= 0) {//返回js代码
        return data;
    } else {//返回没有中括号的数据
        return JSON.parse(data)
        // return data;
    }
}];
//get请求
let get = (url, data) =>
{
    return axios.get(url, {
        params: md5Sign(data)
    });
}
// 取消get请求
let CancelToken = axios.CancelToken;
let cancel;
let getCancel = (url, data) =>
{
    return axios.get(url, {
        cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            cancel = c;
        }),
        params: md5Sign(data)
    });
}
//post请求
let post = (url, data) =>
{
    return axios.post(url, qs.stringify(md5Sign(data)))
    // return axios.post(url, md5Sign(data))
}
// post 发送表单数据
let postFormData = (url, data) =>
{
    data = md5Sign(data);
    var formData = new FormData();
    for (let key in data) {
        formData.append(key, data[key])
    }
    return axios.post(url, formData)
}
let payGet = (url, data, fun) =>
{
    axios.get(url, {
        params: md5Sign(data)
    }).then(function (response) {
        fun(response);
    }).catch(function (err) {
        console.log(err);
    });
}
export {
    get,
    getCancel,
    post,
    cancel,
    postFormData,
    payGet
}
