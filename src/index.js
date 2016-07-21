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

  const remoteUrl = `${apiUrl}/documents/remote?${
    queryString.stringify({ type: query.type, id: query.id })
  }`;
  httpGetJSON(remoteUrl, (documentErr, documentResponse) => {
    if (documentErr) {
      // eslint-disable-next-line no-console
      console.error(documentErr);
      return;
    }
    if (documentResponse.status === 404) {
      // eslint-disable-next-line no-console
      console.log(`Document with type ${query.type} and id ${query.id} not found on PaperHive`);
      return;
    }
    if (documentResponse.status !== 200) {
      // eslint-disable-next-line no-console
      console.error(`Expected status code 200 (got ${documentResponse.status})`);
      return;
    }
    const discussionsUrl = `${apiUrl}/documents/${documentResponse.body.id}/discussions`;
    httpGetJSON(discussionsUrl, (discussionsErr, discussionsResponse) => {
      if (documentErr) {
        // eslint-disable-next-line no-console
        console.error(documentErr);
        return;
      }
      if (documentResponse.status !== 200) {
        // eslint-disable-next-line no-console
        console.error(`Expected status code 200 (got ${documentResponse.status})`);
        return;
      }
      const hiversUrl = `${apiUrl}/documents/${documentResponse.body.id}/hivers`;
      httpGetJSON(hiversUrl, (hiversErr, hiversResponse) => {
        if (documentErr) {
          // eslint-disable-next-line no-console
          console.error(documentErr);
          return;
        }
        if (documentResponse.status !== 200) {
          // eslint-disable-next-line no-console
          console.error(`Expected status code 200 (got ${documentResponse.status})`);
          return;
        }
        updateHtml({
          logo,
          numDiscussions: discussionsResponse.body.discussions.length,
          numHives: hiversResponse.body.hivers.length,
          shortenNumber,
          url: `https://paperhive.org/documents/${documentResponse.body.id}`,
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
