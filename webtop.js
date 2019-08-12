//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#Dynamic_module_loading
//
// As of Aug 2019 firefox does not support dynamic import, so we have
// require.js.

let type;

if(/Mobi|Android/i.test(navigator.userAgent))
    type = 'mobile';
else
    type = 'desktop';

require('webtop_' + type + '.js');
