var Ractive = require('ractive/ractive.runtime');

module.exports = function (el, url, shareText) {
	return new Ractive( {
	    el: el,
	    template: require('./socialButtons.ract'),
	    data: {
			url: url,
	        shareText: shareText
	    }
	});
};
