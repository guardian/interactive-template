/**
 * Google analytics
 *
 * USAGE:
 * var analytics = require('./path/to/utils/analytics.js');
 * analytics('create', 'UA-XXX', 'auto');
 * analytics('send', 'pageview', { 'title': 'UN in 70 years' });
 * ...
 * analytics('send', 'event', 'UI', 'click-tap', 'next-item');
 *
 * see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 *
 */

// inject the google analytics tag
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

var created = false;

module.exports = function () {
	if (arguments[0] === 'create' && created) {
		console.warn('Analytics ID already created.')
		return;
	}

	if (arguments[0] === 'create' && !created && !arguments[1]) {
		console.warn('Missing UA-XXX-XX id');
		return;
	}


	if (arguments[0] === 'create' && !created && arguments[1]) {
		created = true;
	}

	if (!window.ga) {
		console.warn('ga function not set on window');
	}
	window.ga.apply(null, arguments);
}