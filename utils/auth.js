let key = "login-token";

export function $getStorage(key) {
  try {
    return uni.getStorageSync(key)
  } catch (e) {
    return null
  }
}

export function $setStorage(key, data) {
  try {
    uni.setStorageSync(key, data)
  } catch (e) {
    throw new Error("setStorage Error")
  }
}

export function $removeStorage(key) {
  uni.removeStorage({
    key: key
  })
}
