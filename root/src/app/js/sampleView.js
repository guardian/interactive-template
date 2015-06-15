var html = '<div> Example view with <button class="colourBtn">Click to change colour</button>';
var el = document.createElement('div');
el.innerHTML = html;

var btn = el.querySelector('.colourBtn');
btn.addEventListener('click', onClick, false);

function onClick() {
    el.style.backgroundColor = 'hsl(' + (Math.random() * 360) + ',100%,50%)';
}

module.exports = el;
