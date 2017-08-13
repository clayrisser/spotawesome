import React, { Component } from 'react';
import PropTypes from 'prop-types';
import history from '../core/history';
import _ from 'lodash';

class Link extends Component {
  static defaultProps = {
    inherit: false,
    onClick: null,
    style: {},
    to: '#'
  };
  static propTypes = {
    children: PropTypes.node.isRequired,
    inherit: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    to: PropTypes.string
  };

  state = {};

  render() {
    let style = {};
    if (this.props.inherit) style = _.assign({}, style, {
      color: 'inherit',
      textDecoration: 'inherit'
    });
    style = _.assign({}, style, this.props.style);
    let to = this.props.to;
    let children = this.props.children;
    return (<a href={to} style={style} onClick={this.handleClick.bind(this)}>
      {children}
    </a>);
  }

  handleClick(e) {
    if (this.props.onClick) this.props.onClick(e);
    if (this.isModifiedEvent(e) || !this.isLeftClickEvent(e)) return;
    if (e.defaultPrevented === true) return;
    e.preventDefault();
    history.push(this.props.to);
  }

  isModifiedEvent(e) {
    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
  }

  isLeftClickEvent(e) {
    return e.button === 0;
  }
}

export default Link;
