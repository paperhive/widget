var queryString = require('query-string');

require('./index.html');
require('./index.scss');
var utils = require('./utils.js');
var logo = require('../static/img/logo-hexagon.svg');

var apiUrl = 'https://paperhive.org/api';

var template = require('./index.ejs');

function updateHtml(data) {
  document.body.innerHTML = template(data);
}

var query = queryString.parse(window.location.search);

utils.httpGetJSON(apiUrl + '/documents/remote?' + queryString.stringify({type: query.type, id: query.id}), function(documentRevision) {
  utils.httpGetJSON(apiUrl + '/documents/' +  documentRevision.id + '/discussions', function(discussionsResponse) {
    updateHtml({
      logo: logo,
      numDiscussions: discussionsResponse.discussions.length,
      numHives: 15,
      url: 'https://paperhive.org/documents/' + documentRevision.id,
    });
  });
});



// -----
// TODO: check if user is signed up with PaperHive
// ask local storage
// yes: Hive button
// no: explanation
