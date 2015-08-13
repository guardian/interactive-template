var getJSON = require('./js/utils/getjson');
var template = require('./html/base.html');

function doStuff (data) {
	
};

function boot(el) {
	el.innerHTML = template;
	var key = '1hy65wVx-pjwjSt2ZK7y4pRDlX9wMXFQbwKN0v3XgtXM';
	var url = 'http://interactive.guim.co.uk/spreadsheetdata/' + key + '.json';
	getJSON(url, doStuff);
}

module.exports = { boot: boot };