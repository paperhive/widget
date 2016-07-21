import queryString from 'query-string';

import './index.html';
import './index.scss';
import { httpGetJSON, shortenNumber } from './utils.js';
import logo from '../static/img/logo-hexagon.svg';
import template from './index.ejs';

const apiUrl = 'https://paperhive.org/api';

function updateHtml(data) {
  document.body.innerHTML = template(data);
}

function getData() {
  const query = queryString.parse(window.location.hash);

  httpGetJSON(apiUrl + '/documents/remote?' + queryString.stringify({type: query.type, id: query.id}), (documentErr, documentResponse) => {
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
    httpGetJSON(apiUrl + '/documents/' +  documentResponse.body.id + '/discussions', (discussionsErr, discussionsResponse) => {
      if (documentErr) {
        console.error(documentErr);
        return;
      };
      if (documentResponse.status !== 200) {
        console.error('Expected status code 200 (got ' + documentResponse.status + ')');
        return;
      }
      httpGetJSON(apiUrl + '/documents/' +  documentResponse.body.id + '/hivers', (hiversErr, hiversResponse) => {
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
          shortenNumber,
          url: 'https://paperhive.org/documents/' + documentResponse.body.id,
        });
      });
    });
  });
}

window.addEventListener('hashchange', getData);
getData();


// -----
// TODO: check if user is signed up with PaperHive
// ask local storage
// yes: Hive button
// no: explanation
