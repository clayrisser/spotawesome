export default {
  path: '/',
  children: [
    require('./home').default,
    require('./notFound').default
  ]
};
