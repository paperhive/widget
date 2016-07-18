var template = require('lodash/template');
var queryString = require('query-string');

require('./index.html');
require('./index.scss');
var utils = require('./utils.js');

var apiUrl = 'https://paperhive.org/api';

var compiled = template('hello <%= user %>!');
console.log(compiled({ 'user': 'fred' }));

var query = queryString.parse(window.location.search);

utils.httpGetJSON(apiUrl + '/documents/remote?' + queryString.stringify({type: query.type, id: query.id}), function(documentRevision) {
  utils.httpGetJSON(apiUrl + '/documents/' +  documentRevision.id + '/discussions', function(discussionsResponse) {
    var numDiscussions = discussionsResponse.discussions.length;

    var badge = document.getElementById('badge');
    badge.innerHTML = utils.shortenNumber(numDiscussions);
    var discussions = document.getElementById('discussions');
    discussions.innerHTML = utils.shortenNumber(numDiscussions);

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
