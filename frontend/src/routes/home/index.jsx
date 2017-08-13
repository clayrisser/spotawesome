import React from 'react';
import Home from './Home';
import config from '../../config';

const title = config.title;

export default {
  path: '/',
  action() {
    return {
      title: title,
      component: <Home title={title} />
    };
  }
}
