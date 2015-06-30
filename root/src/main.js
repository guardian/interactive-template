var Ractive = require('ractive');
var getJSON = require('./js/utils/getjson');

/**
 * Boot the app.
 * @param {object:dom} el - <figure> element on the page. 
 */
function boot(el) {
	var app = new Ractive({
		el: el,
		template: require('./html/base.html'),
		data: {
			games: require('./data/data.json')
		},
		components: {
			subView: require('./js/subView'),
			socialButtons: require('./js/components/socialButtons')
		},
		updateView: function (data) {
			app.set('games', data.sheets.games);
		}
	});

	var key = '1hy65wVx-pjwjSt2ZK7y4pRDlX9wMXFQbwKN0v3XgtXM';
	var url = 'https://interactive.guim.co.uk/spreadsheetdata/' + key + '.json';

	getJSON(url, app.updateView);
}

module.exports = { boot: boot };
