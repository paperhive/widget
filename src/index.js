import co from 'co';
import queryString from 'query-string';

import { response2json, shortenNumber } from './utils';

// for webpack
import './index.html';
import css from './index.scss';
import logo from '../static/img/logo-hexagon.svg';
import template from './index.ejs';

const apiUrl = 'https://paperhive.org/api';

const getData = co.wrap(function* getDataWrapped(type, id) {
  if (!type || !id) throw new Error('Type and id parameters are mandatory.');

  const documentQuery = queryString.stringify({ type, id });
  const documentResponse = yield fetch(`${apiUrl}/documents/remote?${documentQuery}`);
  if (documentResponse.status === 404) return undefined;

  const doc = yield response2json(documentResponse);

  // get stats
  const statsResponse = yield fetch(`${apiUrl}/documents/${doc.id}/stats`);
  const stats = yield response2json(statsResponse);

  return { doc, stats };
});

function updateHtml(target, data) {
  const details = [];

  if (data.stats.numDiscussions === 1) {
    details.push(`${data.stats.numDiscussions} discussion`);
  }
  if (data.stats.numDiscussions > 1) {
    details.push(`${shortenNumber(data.stats.numDiscussions)} discussions`);
  }

  if (data.stats.numHivers === 1) {
    details.push(`${data.stats.numHivers} hive`);
  }
  if (data.stats.numHivers > 1) {
    details.push(`${shortenNumber(data.stats.numHivers)} hives`);
  }

  if (details.length === 0) {
    details.push('Be the first to comment!');
  }

  // eslint-disable-next-line no-param-reassign
  target.innerHTML = template({
    css,
    logo,
    details: details.join(' · '),
    data,
    shortenNumber,
    url: `https://paperhive.org/documents/${data.doc.id}`,
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
