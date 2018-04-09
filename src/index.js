import co from 'co';
import queryString from 'query-string';

import { response2json, shortenNumber } from './utils';

// for webpack
import './index.html';
import css from './index.scss';
import logo from '../static/img/logo-hexagon.svg';
import bolt from '../static/img/bolt.svg';
import template from './index.ejs';

const apiUrl = 'https://staging.paperhive.org/api';
const frontendUrl = 'https://staging.paperhive.org';

const getData = co.wrap(function* getDataWrapped(type, id) {
  if (!type || !id) throw new Error('Type and id parameters are mandatory.');

  const documentQuery = queryString.stringify({ type, id });
  const documentResponse = yield fetch(`${apiUrl}/document-items/by-document/external?${documentQuery}`);
  if (documentResponse.status === 404) return undefined;

  const body = yield response2json(documentResponse);
  const documentItem = body.documentItems[0];

  // get stats
  const statsResponse = yield fetch(`${apiUrl}/document-items/by-document/${documentItem.document}/stats`);
  const stats = yield response2json(statsResponse);

  return { documentItem, stats };
});

function updateHtml(target, data) {
  const details = [];

  if (data.stats.discussions === 1) {
    details.push(`${data.stats.discussions} discussion`);
  }
  if (data.stats.discussions > 1) {
    details.push(`${shortenNumber(data.stats.discussions)} discussions`);
  }

  if (data.stats.documentSubscriptions === 1) {
    details.push(`${data.stats.documentSubscriptions} subscription`);
  }
  if (data.stats.documentSubscriptions > 1) {
    details.push(`${shortenNumber(data.stats.documentSubscriptions)} subscriptions`);
  }

  if (details.length === 0) {
    details.push('Be the first to comment!');
  }

  // eslint-disable-next-line no-param-reassign
  target.innerHTML = template({
    css,
    logo,
    bolt,
    details: details.join(' · '),
    data,
    shortenNumber,
    url: `${frontendUrl}/documents/items/${data.documentItem.id}`,
  });
}

// for iframe
const onHashChange = co.wrap(function* onHashChangeWrapped() {
  const query = queryString.parse(window.location.hash);
  const data = yield getData(query.type, query.id);
  if (!data) return;
  const target = document.getElementsByClassName('ph-iframe-target')[0];
  updateHtml(target, data);
});

// for standalone script
const processElement = co.wrap(function* processElementWrapped(element) {
  // reset element
  // eslint-disable-next-line no-param-reassign
  element.innerHTML = '';

  // get data
  const type = element.getAttribute('data-type');
  const id = element.getAttribute('data-id');
  const data = yield getData(type, id);
  if (!data) return;

  // check if shadow DOM is supported
  if (element.createShadowRoot) {
    const shadow = element.createShadowRoot();
    updateHtml(shadow, data);
  } else {
    // insert iframe
    // eslint-disable-next-line no-param-reassign
    element.innerHTML = `
      <iframe
        src="https://paperhive.org/widget/#type=${type}&id=${id}"
        style="border:none;overflow:hidden;width:100%;"
        width="100%" height="40px" scrolling="no" frameborder="0"
        allowtransparency="true"
      ></iframe>
    `;
  }
});

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

// wait until DOM has loaded
setTimeout(init);
