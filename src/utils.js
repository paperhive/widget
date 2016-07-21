// 10000 => 10K, 10000000 => 10M
export function shortenNumber(number) {
  if (number < 1e3) return number;
  if (number < 1e6) return Math.floor(number / 1e3) + 'K';
  if (number < 1e9) return Math.floor(number / 1e6) + 'M';
  return '>999M';
}

// HTTP request -> GET number of discussions for and link to document
// TODO replace with fetch (https://developer.mozilla.org/en/docs/Web/API/Fetch_API)
export function httpGetJSON(url, callback) {
  const request = new XMLHttpRequest();
  request.onload = function() {
    // receive response from PaperHive Server
    let body;
    try {
      body = JSON.parse(request.responseText);
    } catch (error) {
      callback(new Error('could not parse JSON'));
      return;
    }
    callback(undefined, {status: this.status, body: body});
  }
  request.onerror = function() {
    callback(new Error('HTTP request failed (possibly a network error)'));
  }
  request.open('GET', url, true);
  request.send(null);
}
