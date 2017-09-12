import React from 'react';
import Login from './Login';
import config from '../../config';

const title = 'login';

export default {
  path: '/login',
  action() {
    return {
      title: title,
      component: <Login title={title} />
    };
  }
}
