import co from 'co';
import queryString from 'query-string';

import './index.html';
import './index.scss';
import { response2json, shortenNumber } from './utils.js';
import logo from '../static/img/logo-hexagon.svg';
import template from './index.ejs';

const apiUrl = 'https://paperhive.org/api';

const getData = co.wrap(function* getData() {
  const query = queryString.parse(window.location.hash);

  const remoteUrl = `${apiUrl}/documents/remote?${
    queryString.stringify({ type: query.type, id: query.id })
  }`;
  const documentResponse = yield fetch(remoteUrl);
  if (documentResponse.status === 404) {
    throw new Error(`Document with type ${query.type} and id ${query.id} not found on PaperHive`);
  }
  const doc = yield response2json(documentResponse);

  // get discussions and hivers
  const [discussionsResponse, hiversResponse] = yield [
    fetch(`${apiUrl}/documents/${doc.id}/discussions`),
    fetch(`${apiUrl}/documents/${doc.id}/hivers`),
  ];
  const [discussions, hivers] =
    yield [response2json(discussionsResponse), response2json(hiversResponse)];

  return {
    doc,
    discussions: discussions.discussions,
    hivers: hivers.hivers,
  };
});

const update = co.wrap(function* update() {
  const target = window.document.body;
  try {
    const { doc, discussions, hivers } = yield getData();
    target.innerHTML = template({
      logo,
      numDiscussions: discussions.length,
      numHives: hivers.length,
      shortenNumber,
      url: `https://paperhive.org/documents/${doc.id}`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    target.innerHTML = '';
  }
});

window.addEventListener('hashchange', update);
update();


// -----
// TODO: check if user is signed up with PaperHive
// ask local storage
// yes: Hive button
// no: explanation
