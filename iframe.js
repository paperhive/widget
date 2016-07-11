// TODO
// how to resize img / iframe etc. dynamically

// -----



// TODO use webpack (GitHub repo https://github.com/sindresorhus/query-string/blob/master/index.js)
// parse and decode query string
function parse(str) {
	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		key = decodeURIComponent(key);

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		if (ret[key] === undefined) {
			ret[key] = val;
		} else if (Array.isArray(ret[key])) {
			ret[key].push(val);
		} else {
			ret[key] = [ret[key], val];
		}
	});

	return ret;
};

var type = parse(window.location.search).type;
var doi = parse(window.location.search).doi;


// HTTP request -> GET number of discussions for document with DOI
//              -> GET link to document
// TODO replace with fetch (https://developer.mozilla.org/en/docs/Web/API/Fetch_API)
function httpGet(url) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    // if (xhr.readyState == XMLHttpRequest.DONE) {
    if (this.readyState === 4 && this.status === 200) {
      // TODO callback(request.responseText);
      // receive response from PaperHive Server
      alert(this.responseText);
    }
  }
  request.open('GET', url, true); // true for asynchronous
  // request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');  // Tells server that this call is made for ajax purposes.
  request.send(null);
}

httpGet(https://paperhive.org/api/documents/remote?type=doi&id=10.1016/j.neurobiolaging.2014.04.026);


// show data in iframe
// number of dicussions
window.onload = function() {
  document.getElementById("ph-label").innerHTML = 11;
}



// -----
// TODO: check if user is signed up with PaperHive
// ask local storage
// yes: Hive button
// no: explanation
