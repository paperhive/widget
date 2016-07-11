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



// TODO: GET number of discussions for document with DOI
// TODO: GET link to document (?)

// TODO: Receive response from PaperHive Server

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
