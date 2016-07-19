# PaperHive widget [![Build Status](https://travis-ci.org/paperhive/paperhive-widget.svg?branch=master)](https://travis-ci.org/paperhive/paperhive-widget)

![example](https://cloud.githubusercontent.com/assets/3831683/16951201/52300ab0-4dc4-11e6-8257-7be9e935e8c5.png)

```
<iframe
  src="https://staging.paperhive.org/widget/#type=arxiv&id=1603.00059"
  width="100%"
  height="40px"
  style="border:none;overflow:hidden;width:100%;"
  scrolling="no"
  frameborder="0"
  allowtransparency="true"
></iframe>
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
