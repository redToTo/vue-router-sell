import axios from 'axios'

// 定义一个get函数，内部再次定义一个函数调用axios对data.json进行访问
// 访问成功时erron是0，同时获取到data属性，作为返回值，返回给params给上一级函数
const ERR_OK = 0
export function get (url) {
  return function (params) {
    return axios.get(url, {
      params
    }).then((res) => {
      const { errno, data } = res.data
      if (errno === ERR_OK) {
        return data
      }
    }).catch((err) => {
      console.log(err)
    })
  }
}
