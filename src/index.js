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

var query = queryString.parse(window.location.hash);

utils.httpGetJSON(apiUrl + '/documents/remote?' + queryString.stringify({type: query.type, id: query.id}), function(documentErr, documentResponse) {
  if (documentErr) {
    console.error(documentErr);
    return;
  };
  if (documentResponse.status === 404) {
    console.log('Document with type ' + query.type + ' and id ' + query.id + ' not found on PaperHive');
    return;
  }
  if (documentResponse.status !== 200) {
    console.error('Expected status code 200 (got ' + documentResponse.status + ')');
    return;
  }
  utils.httpGetJSON(apiUrl + '/documents/' +  documentResponse.body.id + '/discussions', function(discussionsErr, discussionsResponse) {
    if (documentErr) {
      console.error(documentErr);
      return;
    };
    if (documentResponse.status !== 200) {
      console.error('Expected status code 200 (got ' + documentResponse.status + ')');
      return;
    }
    utils.httpGetJSON(apiUrl + '/documents/' +  documentResponse.body.id + '/hivers', function(hiversErr, hiversResponse) {
      if (documentErr) {
        console.error(documentErr);
        return;
      };
      if (documentResponse.status !== 200) {
        console.error('Expected status code 200 (got ' + documentResponse.status + ')');
        return;
      }
      updateHtml({
        logo: logo,
        numDiscussions: discussionsResponse.body.discussions.length,
        numHives: hiversResponse.body.hivers.length,
        url: 'https://paperhive.org/documents/' + documentResponse.body.id,
      });
    });
  });
});



// -----
// TODO: check if user is signed up with PaperHive
// ask local storage
// yes: Hive button
// no: explanation
