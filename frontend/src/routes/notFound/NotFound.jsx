import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './NotFound.scss';

class NotFound extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  state = {};

  render() {
    return (<div>
      <h1>Page Not Found</h1>
      <p>Oooops, I couldn't find the page you were looking for</p>
    </div>);
  }
}

export default withStyles(s)(NotFound);
