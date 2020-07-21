url = {
	'-1':'系统错误',
	'-100':'参数错误',
	'-102':'未登录',
	'-103':'操作错误',
}
function toDateTime(time) {
	var date = new Date(time);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
	var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
	strDate = Y+M+D+h+m+s;
	return strDate;
}
function getFirstMsg(obj){
	if(typeof obj == 'string')
		return obj
	for(var i in obj){
		return i+' '+obj[i]
	}
}
module.exports = {
	url,
	toDateTime,
	getFirstMsg,
}
