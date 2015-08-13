/**
 * Guardian visuals interactive project
 *
 * ./utils/analytics.js - Add Google analytics
 * ./utils/detect.js	- Device and env detection
 */

var getJSON = require('./utils/getjson');
var template = require('./html/base.html');

function doStuff(data, el) {
	// Do stuff
}

function boot(el) {
	el.innerHTML = template;

	var key = '1hy65wVx-pjwjSt2ZK7y4pRDlX9wMXFQbwKN0v3XgtXM';
	var url = 'https://interactive.guim.co.uk/spreadsheetdata/' + key + '.json';
	getJSON(url, function(data) {
		doStuff(data, el);
	});
}

module.exports = { boot: boot };
