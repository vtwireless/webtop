# webtop

Javascript, HTML5, CSS to make a simple desktop in a browser page

## Working example

See webtop examples at <a
    href="https://vtwireless.github.io/webtop/"
    >https://vtwireless.github.io/webtop/</a>

## GitHub Source

- git clone https://github.com/vtwireless/webtop.git
- git clone git@github.com:vtwireless/webtop.git

## Development or usage with a simple web server

This code works without a server.  You can just run:
*firefox index.html* and click links there in.

To install the webfs web server with it running as a service on Debian 9:
  * *apt-get install webfs*
  * *service disable webfs*
  * *service stop webfs*
Now you have *webfs* installed and are not running a service with it.  We
can run a webfs server in the forground, with this directory as the root
of the server, using port 9190, logging to the foreground, only excepting
connections from the local host, and we added *.mjs as a mime type with:
  * *webfsd -r . -F -p 9190 -L - -i localhost -m mime.types*

Note: without the mine types adding *.mjs, the web pages will not work.

You can use your favorite browser on you local computer with the URL:
  * *http://localhost:9190/webtop_test.html*

## Making github web pages

We setup the web pages at URL
https://vtwireless.github.io/webtop/index.html with:
  * *git clone git@github.com:vtwireless/webtop.git webtop_pages*
  * *cd webtop_pages*
  * *git checkout --orphan gh-pages*
  * *git rm -rf .*
Add files:
  * *git add files*
  * *git commit -a -m "Adding pages"*
  * *git push origin gh-pages*

