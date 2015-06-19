define([], function(app) {
    var css = document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = '/css/main.css#grunt-cache-bust';
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(css);
    
    var script = document.createElement('script');
    script.src = '/js/main.js#grunt-cache-bust';
    head.appendChild(script);
    
    return { boot: function(el) { window.gv_el = el; } };
});
