// var apiUrl = 'https://paperhive.org/api';
// var apiUrl = 'http://localhost:8000';
var apiUrl = 'https://staging.paperhive.org/api';


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

var query = parse(window.location.search);


// HTTP request -> GET number of discussions for and link to document
// TODO replace with fetch (https://developer.mozilla.org/en/docs/Web/API/Fetch_API)
function httpGetJSON(url, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      callback(JSON.parse(request.responseText));
      // receive response from PaperHive Server
    }
  }
  request.open('GET', url, true);
  request.send(null);
}

function shortenNumber(number) {
  if (number < 1e3) return number;
  if (number < 1e6) return Math.floor(number / 1e3) + 'K';
  if (number < 1e9) return Math.floor(number / 1e6) + 'M';
  return '>999M';
}

httpGetJSON(apiUrl + '/documents/remote?type=' + encodeURIComponent(query.type) + '&id=' + encodeURIComponent(query.id), function(documentRevision) {
  httpGetJSON(apiUrl + '/documents/' +  documentRevision.id + '/discussions', function(discussionsResponse) {
    var numDiscussions = discussionsResponse.discussions.length;

    var badge = document.getElementById('badge');
    badge.innerHTML = shortenNumber(numDiscussions);
    var discussions = document.getElementById('discussions');
    discussions.innerHTML = shortenNumber(numDiscussions);

    var documentLink = 'https://paperhive.org/documents/' + documentRevision.id;
    document.getElementById('description-link').href = documentLink;
    document.getElementById('logo-link').href = documentLink;
  });
});





// -----
// TODO: check if user is signed up with PaperHive
// ask local storage
// yes: Hive button
// no: explanation
