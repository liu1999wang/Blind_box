const device = uni.getSystemInfoSync()

// #ifdef MP-TOUTIAO || MP-KUAISHOU
let statusBar = device.statusBarHeight;
let customBar = 0;
if (device.platform == 'android') {
	customBar = device.statusBarHeight + 48;
} else {
	customBar = device.statusBarHeight + 44;
};
let menuHeight = 32;
// #endif

// #ifdef MP-WEIXIN
let statusBar = device.statusBarHeight;
let customBar = 0;
if (device.platform == 'android') {
	customBar = device.statusBarHeight + 48;
} else {
	customBar = device.statusBarHeight + 44;
};
let menuHeight = 32;
// #endif	

// #ifdef APP-PLUS
let statusBar = device.statusBarHeight;
let customBar = 0;
if (device.platform == 'android') {
	customBar = device.statusBarHeight + 48;
} else {
	customBar = device.statusBarHeight + 44;
};
let menuHeight = 32;
// #endif	

// #ifdef H5
let statusBar = 0
let customBar  = 0
// #endif

// #ifdef MP-ALIPAY
let statusBar = device.statusBarHeight;
let customBar = device.statusBarHeight + device.titleBarHeight;
// #endif

// 设备信息
const deviceInfo = {
	height: device.screenHeight,
	width: device.screenWidth,
	system: device.system,
	model: device.model,
	platform: device.platform,
	statusBar: statusBar,
	customBar: customBar
}

// console.log(deviceInfo)

const dev = 'https://api.fk123.hebide.cc'    // 你的测试api地址

const prod = "https://api.fk123.hebide.cc"  // 你的正式api地址



module.exports = {
	VERSIONS: "1.0.0",
	BASE_URL: process.env.NODE_ENV === 'development' ? dev : prod,
	DEVICE_INFO: deviceInfo
}
