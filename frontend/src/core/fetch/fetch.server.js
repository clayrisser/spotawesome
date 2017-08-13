import fetch from 'node-fetch';
import config from '../../config';

fetch.Promise = Promise;
fetch.Response.Promise = Promise;

function localUrl(url) {
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http')) return url;
  return `${config.host}${url}`;
}

export default (url, options) => {
  return fetch(localUrl(url), options);

};
export const Headers = fetch.Headers;
export const Request = fetch.Request;
export const Response = fetch.Response;
