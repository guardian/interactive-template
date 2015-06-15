var getJSON = require('./libs/getjson'); 
var sampleJSON = require('./data/sampleData.json');    
var temlplateHTML = require('./templates/base.html');
var sampleView = require('./sampleView');
var ractiveSocial = require('./components/socialButtons');



var el;

// Load remote JSON data
var key = '1hy65wVx-pjwjSt2ZK7y4pRDlX9wMXFQbwKN0v3XgtXM';
var url = '//visuals.guim.co.uk/spreadsheetdata/'+key+'.json';

getJSON(url, updateView);

function updateView(data) {
	var outputEl = el.querySelector('.output');
	outputEl.innerHTML = '';
	data.sheets.Sheet2.forEach(function(disc) {
        var li = document.createElement('li');
        li.innerHTML = '<li>' + disc.album + '</li>';
		outputEl.appendChild(li);
	});
}

function boot(_el) {
	// Store reference to <figure> el
	el = _el;
	
	// Example of writing HTML to the page	
	el.innerHTML = temlplateHTML;
		
	// Example of adding a view from seperate file
	el.querySelector('.subView').appendChild(sampleView);
	
	// Example of a ractiveJS view
	ractiveSocial('.ractiveOutput', 'http://example.com/', 'Cool social text');
	
	// Example of local JSON data
	console.log('Local data:', sampleJSON);
}

// Setup AMD define export
define(function() { return { boot: boot }; });
