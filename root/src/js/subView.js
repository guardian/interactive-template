var Ractive = require('ractive');

function onrender() {
	console.log('Rendering subview');
}

module.exports = Ractive.extend({
  		isolated: false,
	  	onrender: onrender,
  		template: require('../html/subView.html')
});
