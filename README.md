# PaperHive widget [![Build Status](https://travis-ci.org/paperhive/widget.svg?branch=master)](https://travis-ci.org/paperhive/widget)

![example](https://cloud.githubusercontent.com/assets/3831683/16989765/b8f91a4e-4e95-11e6-84fc-73005b2fbcf0.png)

## Iframe

In order to add the PaperHive widget to your web page we provide an iframe and a script option. You can paste the following `<iframe>` code or the `<div>` below into your template wherever you want the widget to appear.

```
<iframe
  src="https://paperhive.org/widget/#type=doi&id=10.1016/j.neurobiolaging.2016.04.004"
  width="100%"
  height="40px"
  style="border:none;overflow:hidden;width:100%;"
  scrolling="no"
  frameborder="0"
  allowtransparency="true"
></iframe>
```

## Script

If you prefer the script option, include PaperHive's JavaScript file once in your template, ideally just before the closing `</body>` tag.

```
<div class="paperhive-widget" data-type="doi" data-id="10.1016/j.neurobiolaging.2016.04.004"></div>
<script src="https://paperhive.org/widget/index.js" async defer></script>
```

## Build

```
git clone git@github.com:paperhive/paperhive-widget.git --recursive
cd paperhive-widget
npm install
```

**Note on static files:**
Make sure you passed `--recursive` to the clone command (see above). If you
switch branches and want to checkout the static files associated with the
current branch run
```
git submodule update
```

### Production
The following command produces a production bundle in `build/`:
```
npm run build
```

### Development
The following command continuously builds the source, starts a web server
and opens the widget in your browser (automatically reloads on changes):
```
npm run watch
```

## Testing locally

Make sure that the selenium drivers are installed and up-to-date using the following command:

```
npm run install:selenium
```

In ubuntu you need openjdk-8 instead of openjdk-9. (as of 08/19/2016)

After that you can run the e2e tests of the current build with:

```
npm run build
docker build -t widget .
docker run -d --rm --name widget -p 8080:80 -v $(pwd)/test/e2e/index.script.html:/usr/share/nginx/html/index.script.html widget
npm test
docker stop widget
```
