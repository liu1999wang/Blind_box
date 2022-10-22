const getters = {
	setting: state => state.app.setting,
	deviceInfo: state => state.app.deviceInfo,
	baseUrl: state => state.app.baseUrl,
	token: state => state.user.token,
	userInfo: state => state.user.userInfo,
	isBgmPlay: state => state.app.isBgmPlay,
	personalSettings: state => state.user.personalSettings
}

export default getters
