export function formatDate(date,fmt){
  // 用正则匹配fmt （传过来的date是new Date字符串，fmt是 yyyy-MM-dd hh:mm）
  if(/(y+)/.test(fmt)){
    //replace获取年份来取代
    //RegExp.$1是RegExp的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串 ，以此类推，RegExp.$2，RegExp.$3，..RegExp.$99总共可以有99个匹配
    /* 举个栗子 const r = /^(\d{4})-(\d{1,2})-(\d{1,2})$/
       r.exec('2019-10-08')
       console.log(RegExp.$1)  // 2019
       console.log(RegExp.$2)  // 10
       console.log(RegExp.$3)  // 08 */
    //date.getFullYear()+''获取到当前年份，四位数字，转为4为字符串
    //substr（4-匹配正则截取到的4位年份），返回从0开始截取，获取完整年份
    //如果/(yy)/,则截取两位，RegExp.$1长度为2
    fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'')).substr(4-RegExp.$1.length);
  }
  let o = {
    'M+':date.getMonth() + 1,//时间从0开始计算的，因此要+1
    'd+':date.getDate(),
    'h+':date.getHours(),
    'm+':date.getMinutes(),
    's+':date.getSeconds()
  }
  // 遍历属性
  for(let k in o){
    // 构建正则表达，方法同上年份，${k}='M+''d+''h+''m+''s+'
    if(new RegExp(`(${k})`).test(fmt)){
      // 转换为字符串
      let str = o[k]+'';
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));
    }
  }
  return fmt;
};
//因为可能出现09这样子的月份显示，所以根据当前str的长度来判断是否截取显示，如果是9月份长度则为1，那么就从'00'的第1位开始截取，并且拼接，为09
function padLeftZero(str){
  return ('00'+str).substr(str.length);
}