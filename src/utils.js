// take a fetch() response and turn it into JSON (if status is 200)
export function response2json(response) {
  if (response.status !== 200) {
    throw new Error(`Expected status code 200 (got ${response.status})`);
  }
  return response.json();
}

// 10000 => 10K, 10000000 => 10M
export function shortenNumber(number) {
  if (number < 1e3) return number;
  if (number < 1e6) return `${Math.floor(number / 1e3)}K`;
  if (number < 1e9) return `${Math.floor(number / 1e6)}M`;
  return '>999M';
}
