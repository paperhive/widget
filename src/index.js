import co from 'co';
import queryString from 'query-string';

// for webpack
import './index.html';
import './index.scss';
import { response2json, shortenNumber } from './utils.js';
import logo from '../static/img/logo-hexagon.svg';
import template from './index.ejs';

const apiUrl = 'https://paperhive.org/api';

const getData = co.wrap(function* getData(type, id) {
  if (!type || !id) throw new Error('Type and id parameters are mandatory.');

  const remoteUrl =
    `${apiUrl}/documents/remote?${queryString.stringify({ type, id })}`;
  const documentResponse = yield fetch(remoteUrl);
  if (documentResponse.status === 404) {
    throw new Error(`Document with type ${type} and id ${id} not found on PaperHive`);
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

const update = co.wrap(function* update(target, type, id) {
  let html = '';
  try {
    const { doc, discussions, hivers } = yield getData(type, id);
    html = template({
      logo,
      numDiscussions: discussions.length,
      numHives: hivers.length,
      shortenNumber,
      url: `https://paperhive.org/documents/${doc.id}`,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
  // eslint-disable-next-line no-param-reassign
  target.innerHTML = html;
});

// for iframe
function onHashChange() {
  const query = queryString.parse(window.location.hash);
  update(window.document.body, query.type, query.id);
}

// for standalone script
function processElement(element) {
  // TODO: shadow DOM?
  update(element, element.getAttribute('data-type'), element.getAttribute('data-id'));
}

function init() {
  const iframe = document.body.classList.contains('ph-iframe-body');

  if (iframe) {
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
  } else {
    const elements = document.getElementsByClassName('paperhive-widget');
    // elements is *not* a proper Array. Use the Array prototype instead
    // (see https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName)
    Array.prototype.forEach.call(elements, processElement);
  }
}

init();

// -----
// TODO: check if user is signed up with PaperHive
// ask local storage
// yes: Hive button
// no: explanation
