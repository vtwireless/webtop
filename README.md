# webtop
Javascript, HTML5, CSS to make a simple desktop in a browser page

# Example
See the example webtop at <a
    href="https://vtwireless.github.io/webtop/webtop_test.html"
    >https://vtwireless.github.io/webtop/webtop_test.html</a>

# GitHub Source
- git clone https://github.com/vtwireless/webtop.git
- git clone git@github.com:vtwireless/webtop.git

## Making github web pages
  * *git clone git@github.com:vtwireless/webtop.git webtop_pages*
  * *cd webtop_pages*
  * *git checkout --orphan gh-pages*
  * *git rm -rf .*
  * Add files.
  * *git add files*
  * *git commit -a -m "Adding pages"*
  * *git push origin gh-pages*
  * The web page URL should be *http://vtwireless.github.io/webtop/webtop_test.html*

## Development with a simple web server
To install the webfs web server with it running as a service:
  * *apt-get install webfs*
  * *service disable webfs*
  * *service stop webfs*

Now you have *webfs* installed and are not running a service with it.  We
can run a webfs server in the forground, with this directory as the root of
the server, using port 9190,  and logging to the forground with:
  * *webfsd -r . -F -p 9190 -L -*

You can use your favorite browser on you local computer with the URL:
*http://localhost:9190/webtop_test.html*
and
*http://HOSTADDRESS:9190/webtop_test.html*
on a different computer, assuming you can access the computer as HOSTNAME.


