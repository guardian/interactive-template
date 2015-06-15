define(['app/main.js#grunt-cache-bust'], function(app) {
    var css = document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = 'app/main.css#grunt-cache-bust';
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(css);
    return app;
});
