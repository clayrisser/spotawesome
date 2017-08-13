import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ErrorReporter extends Component {
  static defaultProps = {
    title: 'Error'
  }
  static propTypes = {
    error: PropTypes.object.isRequired,
    title: PropTypes.string
  }

  state = {};

  renderStackItems(stackItems) {
    let style = {
      name: {
        fontFamily: 'monospace',
        marginTop: '2em',
        color: '#FFFFFF',
        fontSize: '16px',
        lineHeight: '1.2',
        margin: '16px 0px 0px 0px'
      },
      details: {
        color: 'rgba(255, 255, 255, 0.701961)',
        fontSize: '1em',
        lineHeight: '1.2',
        fontFamily: 'monospace',
        margin: '0px'
      }
    }
    return stackItems.map((item, i) => (<div key={i}>
      <div style={style.name}>
        {item.name}
      </div>
      <div style={style.details}>
        {item.details}
      </div>
    </div>));
  }

  render() {
    let err = this.props.error;
    if (process.env.NODE_ENV !== 'production') {
      let style = {
        root: {
          backgroundColor: '#CC0000',
          height: '100%',
          padding: '10px',
          lineHeight: '1.2'
        },
        title: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#FFFFFF',
          marginBottom: '32px'
        }
      };
      return (<div style={style.root}>
        <div style={style.title}>{`${err.name}: ${err.message}`}</div>
        <div>
          {this.renderStackItems(this.getStackItems(err.stack))}
        </div>
      </div>);
    }
    return (<div>
      <h1>{this.props.title}</h1>
      <p>Sorry, a critical error occurred on this page.</p>
    </div>);
  }

  getStackItems(stack) {
    let stackNames = stack.match(/[\w\d\.]+(?=\s\(.+\))/g);
    let stackDetails = stack.match(/(?!\()[\w\d\.\/\:\-]+(?=\))/g);
    let stackItems = [];
    _.each(stackNames, (name, i) => {
      stackItems.push({
        name: name,
        details: stackDetails[i] ? stackDetails[i] : ''
      });
    });
    return stackItems;
  }
}

export default ErrorReporter;
