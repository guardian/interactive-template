var Ractive = require('ractive');
var getJSON = require('./js/utils/getjson');
var detect = require('./js/utils/detect');
var app;


// Useful detection tool. See js/utils/detect.js for more.
console.log('Is IOS: ', detect.isIOS());
console.log('Connection speed: ', detect.getConnectionSpeed());

/**
 * Update app using fetched JSON data.
 * @param {object:json} data - JSON spreedsheet data.
 */
function updateView(data) {
	app.set('games', data.sheets.games);
}



/**
 * Boot the app.
 * @param {object:dom} el - <figure> element on the page. 
 */
function init() {
	app = new Ractive( {
	    el: el,
	    template: require('./html/base.html'),
	    data: {
			games: require('./data/data.json')
		},
		components: {
			subView: require('./js/subView'),
			socialButtons: require('./js/components/socialButtons')
		}
	});
	
	var key = '1hy65wVx-pjwjSt2ZK7y4pRDlX9wMXFQbwKN0v3XgtXM';
	var url = '//visuals.guim.co.uk/spreadsheetdata/'+key+'.json';
	getJSON(url, updateView);
}

var el = window.gv_el || document.querySelector('.interactive');
init(el);
