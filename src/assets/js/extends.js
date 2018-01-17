Array.prototype.removeByIndex = function (index) {
	if (index > -1) {
		this.splice(index, 1);
	}
}

Array.prototype.remove = function (item) {
	var index = this.indexOf(item);
	this.removeByIndex(index);
}

Array.prototype.add = function (item, index) {
	this.splice(index + 1, 0, item);
}

Array.prototype.orderBy = function (columnName, order) {
	return this.sort(function (x, y) {
		if (order == 'descending') {
			return (x[columnName] < y[columnName]) ? 1 : -1
		}
		else {
			return (x[columnName] > y[columnName]) ? 1 : -1
		}
	});
}

// 获取分页数据
Array.prototype.getPageData = function (pageNumber, pageSize) {
	return this.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function (formatString) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(formatString)) {
		formatString = formatString.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(formatString)) {
			formatString = formatString.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return formatString;
}

String.guid = function () {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}