module.exports = {
	show: ['GET', '/user/clock-in'],
	clock_in: ['PUT', '/user/clock-in'],
	update_image: ['PUT', '/user/clock-in/image'],
	update_diary: ['PUT', '/user/clock-in/diary'],
	update_image_share: ['PUT', '/user/clock-in/image-share'],
	single_show: ['GET', '/clock-in/{uuid}']
}