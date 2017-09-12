export default {
  path: '/',
  children: [
    require('./home').default,
    require('./login').default,
    require('./notFound').default
  ]
};
