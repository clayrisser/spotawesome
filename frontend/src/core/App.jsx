import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { loadStyles, unmountStyles } from './styles';
import { mapStateToProps } from '../redux/configureStore';
import { connect } from 'react-redux';
import _ from 'lodash';

class App extends Component {

  state = {};
  reduxStateKeys = [];

  constructor(props) {
    super(props);
    let contextTypes = {
      insertCss: PropTypes.func.isRequired,
      store: PropTypes.object.isRequired
    }
    this.reduxStateKeys = _.keys(props.context.store.getState());
    _.each(this.reduxStateKeys, (key) => {
      contextTypes[key] = PropTypes[typeof props[key]];
    });
    this.constructor.propTypes = {
      context: PropTypes.shape(contextTypes).isRequired,
      children: PropTypes.element.isRequired
    };
    this.constructor.childContextTypes = contextTypes;
  }

  componentWillMount() {
    loadStyles(this.props.context.insertCss);
  }

  componentWillUnmount() {
    unmountStyles();
  }

  getChildContext() {
    let context = this.props.context;
    _.each(this.reduxStateKeys, (key) => {
      context[key] = this.props[key];
    });
    return this.props.context;
  }

  renderChildren() {
    return cloneElement(Children.only(this.props.children), {});
  }

  render() {
    return (<div style={{height: '100%'}}>
      {this.renderChildren()}
    </div>);
  }
}

export default connect(mapStateToProps)(App);
