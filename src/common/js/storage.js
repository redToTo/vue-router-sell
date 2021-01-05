import storage from 'good-storage'

// 对应的页面(seller页面)
const SELLER_KEY = '__seller__'

//存储到本地 saveToLocal(商家id,针对本项目而言使favorite,favorite的值)
export function saveToLocal(id,key,val) {
  // 如果没有定义过seller的话,使用get方法有默认值是空对象,在这里get方法先取到__seller__这一个页面所有key的内容,包括所有其他的商家在seller页面存储的内容,再根据seller[id]来判断新构建还是修改
  const seller = storage.get(SELLER_KEY,{})
  // 如果没有定义过相对应的id的seller,就将该seller[id]置为空对象
  if(!seller[id]){
    seller[id]={}
  }
  // 构建一个不同商家的不同需要存储的对象的内容,eg.商家页面[粥店的id][favorite]=false(在seller页面favorite的值)
  seller[id][key] = val
  storage.set(SELLER_KEY,seller)
}
//从本地获取 loadFromLocal(商家id,针对本项目而言使favorite,取不到值时的默认值)
export function loadFromLocal(id,key,def) {
  //取值,取不到就是一个空对象
  const seller = storage.get(SELLER_KEY,{})
  if(!seller[id]){
    // 如果取不到值,返回默认值def
    return def
  }
  return seller[id][key] || def
}
