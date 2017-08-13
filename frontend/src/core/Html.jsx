import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../config';

class Html extends Component {
  static defaultProps = {
    scripts: [],
    children: '<div></div>'
  };
  static propTypes = {
    scripts: PropTypes.array,
    children: PropTypes.string
  };

  state = {};

  render() {
    let style = {
      app: {
        padding: '0px',
        margin: '0px',
        height: '100%',
        width: '100%',
        overflow: 'scroll'
      },
      body: {
        padding: '0px',
        margin: '0px',
        height: '100%',
        width: '100%'
      },
      html: {
        padding: '0px',
        margin: '0px',
        height: '100%',
        width: '100%',
        position: 'fixed'
      }
    };
    return (<html style={style.html}>
      <head>
        <meta charSet="utf-8" />
        <title>{config.title}</title>
      </head>
      <body style={style.body}>
        <style type="text/css">${[...this.props.css].join('')}</style>
        <div id="app" style={style.app} dangerouslySetInnerHTML={{__html: this.props.children}} />
        {this.props.scripts.map((script) => (<script key={script} src={script} />))}
      </body>
    </html>)
  }
}

export default Html;
