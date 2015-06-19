define([], function(app) {
    var head = document.head || document.getElementsByTagName('head')[0];
    
    
    function getScript(url) {
        var xhr = new XMLHttpRequest();
        if ('withCredentials' in xhr) {
            xhr.open('GET', url, true);
        } else if(typeof XDomainRequest !== 'undefined') {
            xhr = new XDomainRequest();
            xhr.open('GET', url);
        }
        
        xhr.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
                var percentComplete =  (1 - event.loaded / event.total) * 100;
                clipRect.style.transform = 'translateY(' + percentComplete + '%)';
            } else {
                console.log('dont know size');
            }
        }, false);
    
        xhr.onload = function() {
            if (xhr.status && xhr.status !== 200) {
                console.error('Error fetching file', xhr.status , xhr.statusText);
                return;
            }
            var s = document.createElement('script');
            s.innerHTML = xhr.responseText;
            svg.style.opacity = 0;
            head.appendChild(s);
        };
    
        xhr.onerror = function() {
            console.error('Error fetching JSON');
        };
    
        // IE9 fixes
        xhr.onprogress = function () { };
        xhr.ontimeout = function () { };
        setTimeout(function () {
            xhr.send();
        }, 0);
    }

    var loader = '\r\n<div style=\"height: 300px; width: 100%; position: relative;\">\r\n    <svg id=\"d\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 239 211\" style=\"position: absolute; top: 50%; left: 50%; transform: translate(-50%); transition: 0.2s opacity ease;\">\r\n        <defs>\r\n            <clipPath id=\"b\">\r\n                <rect id=\"c\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" style=\"transform: translateY(100%); transition: 0.2s transform ease;\" \/>\r\n            <\/clipPath>\r\n              <path\r\n                 id=\"a\"\r\n                 fill=\"#999\"\r\n                 d=\"M 239.332,109.973 C 239.332,60.663 209.504,18.323 166.907,2.6757813e-7 181.153,9.2880003 189.8,23.517 190.464,41.756 c 0.224,1.403 0.356,2.757 0.356,4.03 0,35.681999 -29.04,54.65 -71.312,54.65 -10.865,0 -18.207,-0.583001 -27.017,-3.210001 -4.112,2.920001 -7.342,7.605001 -7.342,11.998001 0,5.858 5.286,10.545 11.746,10.545 l 58.736,0 c 36.38,0 54.27,14.9 54.27,47.04 0,10.73 -2.133,20.357 -6.55,28.688 22.198,-21.722 35.98,-52.01 35.98,-85.524 M 69.752,1.1870003 C 28.586,20.107 0,61.699 0,109.973 c 0,32.755 13.164,62.43 34.485,84.04 -0.046,-0.58 -0.08,-1.163 -0.08,-1.752 0,-21.356 20.824,-29.24 39.308,-33.046 l 0,-0.012 c -17.594,-3.802 -26.1,-16.373 -26.1,-29.236 0,-17.25 19.294,-32.130001 28.686,-38.550001 l -1.112,-0.61 C 58.76,81.761999 47.907,65.677 47.907,44.032 c 0,-18.557 8.077,-33.15 21.844,-42.8439997 M 98.181,168.978 c -14.965,0 -19.394,11.057 -19.394,19.254 0,11.842 10.67,22.772 41.77,22.772 35.366,0 44.962,-9.955 44.962,-22.914 0,-11.302 -8.508,-19.112 -22.803,-19.112 l -44.534,0 z m 43.16,-124.945 c 0,-32.76 -9.784,-37.7329997 -21.83,-37.7329997 -11.753,0 -21.535,4.3879997 -21.535,37.7329997 0,33.344999 9.783,36.269999 21.536,36.269999 11.753,0 21.83,-3.51 21.83,-36.269999\"\r\n             \/>\r\n        <\/defs>\r\n            \r\n        <use xlink:href=\"#a\" opacity=\"0.06\"  \/>\r\n        <use xlink:href=\"#a\" opacity=\"0.4\" clip-path=\"url(#b)\" \/>\r\n    <\/svg>\r\n\r\n<\/div>'
    
    
    var css = document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = '/css/main.css#grunt-cache-bust';
    head.appendChild(css);

    var finished;
    var clipRect;
    var svg;
       
    return { boot: function(el) {
        el.innerHTML = loader;
        el.style.margin = '0';
        
        finished = false;
        clipRect = document.querySelector('#c');
        svg = document.querySelector('#d');
        
        getScript('/js/main.js#grunt-cache-bust', 'script');
    
        window.gv_el = el;
    } };
});
