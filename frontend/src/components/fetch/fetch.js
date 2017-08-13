import fetch from '../../core/fetch';

export default (url, options = {}) => {
  if (!options.headers) options.headers = {};
  if (!options.headers['Content-Type']) options.headers['Content-Type'] = 'application/json';
  return fetch(url, options);
};
