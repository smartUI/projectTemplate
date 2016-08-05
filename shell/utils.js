/**
 * @author: Brave <u9648u6653u52c7@gmail.com>
 * @date: 2016-08-04
 */

var fs = require('fs');
var path = require('path');


/**
 * walkDir 文件夹遍历
 * @param {String} path
 * @return {Array} fileList
 */

function walkDir(dir) {
	var fileList = [];
	(function walk(dir) {
		dir = path.resolve(process.cwd(), dir);
		fs.readdirSync(dir).forEach(function (value, index) {
			var realPath = path.resolve(dir, value),
				stat = fs.statSync(realPath);
			if ( stat.isDirectory() ) {
				walk(realPath);
			} else {
				fileList.push(realPath);
			}
		});
	})(dir);
	return fileList;
}


var entryFileTypeREG = /\.jsx?$/;

/**
 * getEntries 获取webpack配置的入口对象
 * @param dir
 * @returns {Object} dict
 */

function getEntries (dir) {
	var dict = {}
		,files = walkDir(dir)
		,key = null;

	/**
	 * generateUniqueKey 生成入口对象的唯一key值
	 * @param {String} path
	 * @param {Object} dict
	 * @returns {String}
	 */

	function generateUniqueKey(path, dict) {
		var arr = path.indexOf('/') != -1 ? path.split('/') : path.split('\\')
			,i = arr.length
			,key = null;
		for (i-=1; 0 <= i; i--) {
			key = entryFileTypeREG.test(arr[i]) ? arr[i].slice(0, arr[i].lastIndexOf('.')) : arr[i];
			if ( !dict.hasOwnProperty(key) ) {
				return key;
			}
		}
	}

	files.forEach(function (value, index) {
		if ( entryFileTypeREG.test(value) ) {
			key = generateUniqueKey(value, dict);
			dict[key] = value;
		}
	});

	return dict;
}

module.exports = {
	walkDir: walkDir,
	getEntries: getEntries
};
