//通过key,value,expire_at设置cookie
export function setCookie(key: string, value: string, expires_at: number) {
  let date = new Date()
  date.setTime(expires_at)
  document.cookie = key + '=' + value + ';expires=' + date.toUTCString() + ';path=/'
}

//删除指定key的cookie
export function delCookie(key: string) {
  let date = new Date()
  date.setTime(date.getTime() - 10000)
  document.cookie = key + '=v;expires=' + date.toUTCString() + ';path=/'
}
