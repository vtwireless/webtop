// There are many other web desktops.  We wanted one that did not require
// a server; so it's just client side javaScript and CSS; and you can use
// it from a single small HTML file.  Not a full-featured desktop.  Just
// a very simple application "window" containers in a browser.
//
//
// https://en.wikipedia.org/wiki/Web_desktop
// https://en.wikipedia.org/wiki/Desktop_metaphor
//
//
// It likely that HTML5 and javaScript will add stuff to make some of this
// code obsolete in the near future.  The element resize and drag events
// are being added to the standards.  Firefox does not support drag yet
// but Chrome does (Tue, July 2, 2019).
//

//
// WebDesktop App = WDApp
//
//
//  <div> elements put in each other like so:
//
//
//      -------------------------win--("window")------------------
//      |                                                        |
//      | -----------header------------------------------------- |
//      | |  --- ----- titleSpan ------    ----- ----- -----   | |
//      | |  |@| |                    |    | - | | M | | X |   | |
//      | |  --- ----------------------    ----- ----- -----   | |
//      | ------------------------------------------------------ |
//      |                                                        |
//      | ------------main-------------------------------------- |
//      | |                                                    | |
//      | | --------------app--------------------------------- | |
//      | | |                                                | | |
//      | | |                                                | | |
//      | | |                                                | | |
//      | | |                                                | | |
//      | | |            User app content  ....              | | |
//      | | |                                                | | |
//      | | |                                                | | |
//      | | |                                                | | |
//      | | |                                                | | |
//      | | |                                                | | |
//      | | |                                                | | |
//      | | -------------------------------------------------- | |
//      | ------------------------------------------------------ |
//      ----------------------------------------------------------
//

//
// Draggable, Resizable, RollUpable, and Iconifible window app made with
// <div>s.
//
// This is the only interface provided, and one interface is a good thing.
//
// example:
//
//  var app = new WDApp('my app', myCanvas);
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


    function makeDivIn(parentNode, className) {

        var child = document.createElement('div');
        child.className = className;
        parentNode.appendChild(child);
        return child;
    }


    if(WTApp.defaultRoot === undefined && !opts['root'])
        var root = new WTRoot;
    else if(WTApp.defaultRoot !== undefined && !opts['root'])
        var root = WTApp.defaultRoot;
    else
        //opts['root'] is set by the user
        var root = opts.root;

    
    this.appIndex = root.totalApps++;

    root.apps.push(this);

    app.style.padding = '0px';
    app.style.margin = '0px';
    app.style.border = 'none';
    app.style.width =  '100%';
    app.style.height = '100%';


    var win = makeDivIn(root.win, 'WTwin');
    this.win = win;
    var header = makeDivIn(win, 'WTheader');
    var main = makeDivIn(win, 'WTmain');
    main.appendChild(app);
    win.style.zIndex = this.appIndex + root.startingZIndex;

    var This = this;

    function popForward() {

        if(This.appIndex === root.totalApps - 1)
            // this app is on top already.
            return;

        // find this app in the list
        // and move it to the last in the list.
        //
        let i = This.appIndex;
        let zIndex = i + root.startingZIndex;
        for(++i;i<root.totalApps;++i) {
            let app = root.apps[i];
            app.win.style.zIndex = zIndex++;
            root.apps[i-1] = app;
            app.appIndex = i-1;
        }
        This.appIndex = i-1;
        root.apps[This.appIndex] = This;
        win.style.zIndex = zIndex;
    }



    // offsetWidth and offsetHeight includes padding, scrollBar and borders.
    win.style.left = (root.win.offsetWidth - win.offsetWidth)/2 + 'px';
    win.style.top = (root.win.offsetHeight - win.offsetHeight)/2 + 'px';

    win.tabIndex = '0';

    // Prevent header and main from letting pointer down events to
    // the win.
    function stop(e) { e.stopPropagation();}
    main.onpointerdown = stop;

    var count = 0;

    header.onpointerdown = function(e) {

        popForward();

        var xInit = e.pageX;
        var yInit = e.pageY;

        removeResizeAction();

        //console.log('header.onpointerdown');

        header.className = 'WTheader_change';

        root.eventCatcher.style.display = 'block';
        root.eventCatcher.style.cursor = 'move';

        e.stopPropagation();

        var moved = false;

        document.onpointermove = function(e) {

            e.stopPropagation();

            // Note:
            //win.style.left = win.offsetLeft + 'px';
            //win.style.top = win.offsetTop + 'px';

            win.style.left = (win.offsetLeft + e.pageX - xInit) + 'px';
            win.style.top = (win.offsetTop + e.pageY - yInit) + 'px';

            xInit = e.pageX;
            yInit = e.pageY;
            moved = true;
        };

        // Stop text in the page from being highlighted:
        var documentOnselectstart = document.onselectstart;

        document.onselectstart = function (e) {
            if(e.preventDefault){ e.preventDefault(); }
            return false;
        }

        document.onpointerup = function(e) {

            header.className = 'WTheader';
            root.eventCatcher.style.display = 'none';
            root.eventCatcher.style.cursor = 'default';
            document.onpointerup = null;
            document.onpointermove = null;
            document.onselectstart = documentOnselectstart;
            root.eventCatcher.onpointermove = null;
            addResizeAction(e);
        };

    };


    // Used to stop text in the page from being highlighted:
    var documentOnselectstart = document.onselectstart;

    function cleanupResizeStuff() {
        document.onpointerup = null;
        win.onpointerdown = null;
        win.onpointerleave = null;
        win.onpointermove = null;
        root.eventCatcher.style.display = 'none';
        document.onselectstart = documentOnselectstart;
        root.eventCatcher.style.cursor = 'default';
    }


    function win_onpointerenter(e) {

        let style = getComputedStyle(win);

        var win_xpadding =
            parseInt(style.getPropertyValue('padding-left')) +
            parseInt(style.getPropertyValue('padding-right'));
        var win_ypadding =
            parseInt(style.getPropertyValue('padding-top')) +
            parseInt(style.getPropertyValue('padding-bottom'));


        // Enumeration so we do not keep setting the cursor again and
        // again.  Values are X + Y*3 where 
        // X = [0,  1,  2] and Y = [0,  1,  2]
        //     min mid max         min mid max
        //      W       E           N       S
        //
        //  X increasing to the east and
        //  Y is increasing to the south
        //   (1,0)(2,1)(1,2)(0,1) (2,0) (0,0) (2,2) (0,2)
        const N=1, E=5, S=7, W=3, NE=2, NW=0, SE=8, SW=6;
        // We use these constants to select a cursor and
        // designate the mode of resize.
        var cursorIndex = 4;
        var cursors = [
            'nw-resize', 'n-resize', 'ne-resize',
            'w-resize', '4-notUsed', 'e-resize', 
            'sw-resize', 's-resize', 'se-resize'
        ];

        cursorIndex = 4;

        function findCursor(e, setit = false) {

            const cornerSize = 20;
            let x = ((e.clientX - win.offsetLeft) < cornerSize)?0:
                (((e.clientX - win.offsetLeft) >
                    win.offsetWidth - cornerSize)?2:1);
            let y = ((e.clientY - win.offsetTop) < cornerSize)?0:
                (((e.clientY - win.offsetTop) >
                    win.offsetHeight - cornerSize)?2:1);
            let newCursorIndex = x + y * 3;

            // Don't change the cursor if we don't need to.
            if(cursorIndex != newCursorIndex || setit) {
                win.style.cursor = cursors[cursorIndex = newCursorIndex];
                root.eventCatcher.style.cursor =
                    cursors[cursorIndex = newCursorIndex];
            }
        }

        findCursor(e);
        root.eventCatcher.style.cursor = win.style.cursor;
        //console.log((count++) + ' win.onpointerenter');

        var gotpointerDown = false;
        var gotpointerLeave = false;


        win.onpointermove = function(e) {

            //console.log((count++) + ' win.onpointermove ' +
            //    'gotpointerDown=' + gotpointerDown);

            if(gotpointerDown) {

                let xi = cursorIndex % 3; // xi = [ 0, 1, 2 ]
                let yi = (cursorIndex - xi)/3; // yi = [ 0, 1, 2 ]

                const minsize = 10;
                
                // Check for resize in X
                if(xi === 2 /*right side*/) {
                    let w = e.clientX - win.offsetLeft - win_xpadding;
                    if(w >= minsize)
                        // CASE right side moving.
                        win.style.width = w + 'px';
                } else if(xi === 0 /*left side*/) {
                    // harder case because the left side is defined as the
                    // anchor (left/top origin) side.
                    // CASE left side moving.
                    let w = win.offsetWidth + win.offsetLeft
                        - e.clientX - win_xpadding;
                    if(w >= minsize) {
                        win.style.width = w + 'px';
                        win.style.left = e.clientX + 'px';
                    }
                }
                // else xi === 1 do not resize in X
                //

                let minH = minsize + header.offsetHeight;

                // Check for resize in Y
                if(yi === 2 /*bottom side*/) {
                    let h = e.clientY- win.offsetTop - win_ypadding;
                    if(h >= minH) {
                        // CASE bottom side moving.
                        win.style.height = h + 'px';
                        main.style.height = (h - header.offsetHeight) + 'px';
                    }
                } else if(yi === 0 /*top side*/) {
                    // harder case because the top side is defined as the
                    // anchor (left/top origin) side.
                    // CASE top side moving.
                    let h = win.offsetHeight + win.offsetTop
                        - e.clientY - win_ypadding;
                    if(h >= minH) {
                        win.style.height = h + 'px';
                        win.style.top = e.clientY + 'px';
                        main.style.height = (h - header.offsetHeight) + 'px';
                    }
                }
                // else yi === 1 do not resize in Y


            } else
                findCursor(e);
        }


        win.onpointerdown = function(e) {

            popForward();

            gotpointerDown = true;
            findCursor(e, true);
            document.onpointermove = win.onpointermove;

            // At this point we are guaranteed to get a
            // document.onpointerup

            root.eventCatcher.style.display = 'block';
            //console.log((count++) +' win.onpointerdown');

            document.onselectstart = function (e) {
                //console.log((count++) + ' document.onselectstart');
                if(e.preventDefault){ e.preventDefault(); }
                return false;
            }

            document.onpointerup = function(e) {
                //console.log((count++) + ' document.onpointerup');
                gotpointerDown = false;
                root.eventCatcher.style.display = 'none';
                document.onselectstart = documentOnselectstart;
                root.eventCatcher.style.cursor = 'default';
                document.onpointermove = null;

                if(gotpointerLeave) {
                    // The pointer left and we have a pointer up.
                    // Cleanup.  We are done.
                    cleanupResizeStuff();
                }
            }
        }

        win.onpointerleave = function() {
            //console.log((count++) + ' win.onpointerleave');
            gotpointerLeave = true;

            if(!gotpointerDown)
                // The pointer is up and the pointer is not in the target
                // region, so cleanup all of it.
                cleanupResizeStuff();
            // else we cleanup when the document.onpointerup pops.
        };
    };


    function removeResizeAction() {
        cleanupResizeStuff();
        win.onpointerenter = null;
    }

    function addResizeAction(e = null) {
        cleanupResizeStuff();
        win.onpointerenter = win_onpointerenter;
        if(e)
            win.onpointerenter(e);
    }

    addResizeAction();
}


// Make a webtop root window and other things
// used to manage the WTApp() objects.
//
function WTRoot(rootWin = null) {

    if(!rootWin) {
        rootWin = document.body;
        rootWin.className = 'WTroot';
    }

    var eventCatcher = document.createElement('div');
    eventCatcher.className = 'WTeventCatcher';
    document.body.appendChild(eventCatcher);

    this.win = rootWin;
    this.eventCatcher = eventCatcher;

    if(WTApp.defaultRoot === undefined)
        WTApp.defaultRoot = this;

    this.startingZIndex = 3;
    this.totalApps = 0;
    this.apps = [];
}

