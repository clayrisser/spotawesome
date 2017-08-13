import 'whatwg-fetch';
import config from '../../config';

function localUrl(url) {
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http')) return url;
  return `${config.host}${url}`;
}

export default (url, options) => {
  return fetch(localUrl(url), options);
};
export const Headers = self.Headers;
export const Request = self.Request;
export const Response = self.Response;
