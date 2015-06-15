var Ractive = require('ractive');
var getJSON = require('./utils/getjson'); 
var app;

/**
 * Update app using fetched JSON data
 * @param {object:json} data - JSON spreedsheet data.
 */
function updateView(data) {
	app.set('games', data.sheets.games);
}


/**
 * Boot the app.
 * @param {object:dom} el - <figure> element passed by boot.js. 
 */
function boot(el) {
	app = new Ractive( {
	    el: el,
	    template: require('./templates/base.html'),
	    data: {
			games: require('./data/data.json')
		},
		components: {
			subView: require('./subView'),
			socialButtons: require('./components/socialButtons')
		}
	});
	
	var key = '1hy65wVx-pjwjSt2ZK7y4pRDlX9wMXFQbwKN0v3XgtXM';
	var url = '//visuals.guim.co.uk/spreadsheetdata/'+key+'.json';
	getJSON(url, updateView);
}

// AMD define for boot.js
define(function() { return { boot: boot }; });
