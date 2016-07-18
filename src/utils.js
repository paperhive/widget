// 10000 => 10K, 10000000 => 10M
module.exports.shortenNumber = function(number) {
  if (number < 1e3) return number;
  if (number < 1e6) return Math.floor(number / 1e3) + 'K';
  if (number < 1e9) return Math.floor(number / 1e6) + 'M';
  return '>999M';
}

// HTTP request -> GET number of discussions for and link to document
// TODO replace with fetch (https://developer.mozilla.org/en/docs/Web/API/Fetch_API)
module.exports.httpGetJSON = function(url, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      callback(JSON.parse(request.responseText));
      // receive response from PaperHive Server
    }
  }
  request.open('GET', url, true);
  request.send(null);
}