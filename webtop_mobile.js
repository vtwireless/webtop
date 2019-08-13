
/*
 

 This is what the desktop widgets look like:


 -------------------------body (or other)---------------------
 |                                                           |
 |  -------------------------top---------------------------  |
 |  |                                                     |  |
 |  |  ---left--   ----------main-----------  --right---  |  |
 |  |  |       |   |                       |  |        |  |  |
 |  |  |       |   |   -------app--------  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |     ^   ^      |  |  |        |  |  |
 |  |  |       |   |   |     *   *      |  |  |        |  |  |
 |  |  |   <   |   |   |       >        |  |  |   >    |  |  |
 |  |  |       |   |   |     \___/      |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   |                |  |  |        |  |  |
 |  |  |       |   |   ------------------  |  |        |  |  |
 |  |  |       |   |                       |  |        |  |  |
 |  |  ---------   -------------------------  ----------  |  |
 |  |                                                     |  |
 |  -------------------------------------------------------  |
 |                                                           |
 -------------------------------------------------------------

*/

require('webtop_mobile.css');


// BUG:  Can't figure out how it's adding vertical space to the body
// making the page add a vertical scroll bar.


// example:
//
//  var app = new WTApp('my app', myCanvas);
//
//
//  OPTIONS:
//
//  opts = {
//
//          close: bool // false to not let it close the app with X
//          root: WTRoot object
//  }
//
// Usage: WTApp(headerText, app)
// Usage: WTApp(headerText, app, opts)
// Usage: WTApp(headerText, app, onclose, opts)
// Usage: WTApp(headerText, app, onclose)
//
//
function WTApp(headerText, app, onclose = null, opts = null) {

    var defaultOpts = {
        close: true,
        root: null
    };

    if(typeof(onclose) === 'object') {
        opts = onclose;
        onclose = null;
    }

    if(typeof(opts) === 'function')
        onclose = opts;
    if(!opts) opts = {};

    Object.keys(defaultOpts).forEach(function(opt) {
        if(opts[opt] === undefined)
            opts[opt] = defaultOpts[opt];
    });


    if(WTApp.defaultRoot === undefined && !opts['root'])
        var root = new WTRoot;
    else if(WTApp.defaultRoot !== undefined && !opts['root'])
        var root = WTApp.defaultRoot;
    else
        //opts['root'] is set by the user
        var root = opts.root;

    root.addApp(app);
}


// Make a webtop root window and other things
// used to manage the WTApp() objects.
//
// There could be any number of root window thingys.  WTRoot() makes the
// object that is a group of apps.
//
// We don't manage all the WTRoot() objects.
//
function WTRoot(rootWin = null) {

    // We keep a list of apps in this object.
    var appObjs = { };

    // Current showing app.
    var showingAppObj = null;

    // last app added.
    var lastAppObj = null;

    if(!rootWin)
        rootWin = document.body;

    // addApp(app)
    //
    //   app, like a <div> or <canvas>
    //
    this.addApp = function(app) {

        // appObj keeps a doubly linked circular list with next and prev,
        // with elements added at lastAppObj.
        //
        var appObj = { app: app };


        if(lastAppObj) {
            if(lastAppObj.next) {
                appObj.next = lastAppObj.next;
                lastAppObj.next.prev = appObj;
            } else {
                appObj.next = lastAppObj;
                lastAppObj.prev = appObj;
            }
            appObj.prev = lastAppObj;
            lastAppObj.next = appObj;
        } else {
            appObj.prev = appObj.next = null;
        }
        // This app is the lastAppObj.
        lastAppObj = appObj;

        if(!showingAppObj) {
            showingAppObj = appObj;
        }

        app.className = 'WTapp';
    }

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    // BUG: TODO: This method of switching seems to cause an app that is a
    // <ifame> to reload all it's content.
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    // Show the next app
    function goToNext() {

        //console.log('next app');
        if(!showingAppObj.next) return;

        main.removeChild(main.firstChild);
        showingAppObj = showingAppObj.next;
        //console.log('Switching to: ' + showingAppObj.app.outerHTML);
        main.appendChild(showingAppObj.app);
    };

    // Show the prev app
    function goToPrev() {

        //console.log('prev app');
        if(!showingAppObj.prev) return;

        main.removeChild(main.firstChild);
        showingAppObj = showingAppObj.prev;
        //console.log('Switching to: ' + showingAppObj.app.outerHTML);
        main.appendChild(showingAppObj.app);
    };


    // The first app will be the current content of the body.
    var div = document.createElement('div');

    //div.style.cssText =
    //    document.defaultView.getComputedStyle(rootWin, "").cssText;

    while(rootWin.firstChild)
        div.appendChild(rootWin.firstChild);
    this.addApp(div);
    div.className = 'WTfirst';

    var top = document.createElement('div');
    top.className = 'WTtop';

    // The < widget
    let left = document.createElement('div');
    left.className = 'WTleft';
    left.appendChild(document.createTextNode('<'));
    top.appendChild(left);
    left.tabIndex = '0';
    left.onclick = function() { goToPrev(); };

    // The current displayed app container.
    var main = document.createElement('div');
    main.className = 'WTmain';
    top.appendChild(main);

    // The > widget
    let right = document.createElement('div');
    right.className = 'WTright';
    right.appendChild(document.createTextNode('>'));
    top.appendChild(right);
    right.tabIndex = '0';
    right.onclick = function() { goToNext(); };

    rootWin.appendChild(top);

    // Setup showing app
    main.appendChild(lastAppObj.app);


    WTApp.defaultRoot = this;
}

