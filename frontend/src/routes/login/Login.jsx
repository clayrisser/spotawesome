import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.scss';
import Layout from '../../components/Layout';

class Login extends Component {
  constructor() {
    super();
  }

  render() {
    return (<div>
      <Layout>
        <button onClick={this.handleLogin.bind(this, 'github')}>Login with Github</button>
      </Layout>
    </div>);
  }

  handleLogin(provider) {
    const popup = window.open(`http://localhost:8806/api/v1/auth/provider/${provider}`)
    const interval = setInterval(() => {
      if (popup.closed) {
        fetch('http://localhost:8806/api/v1/auth/login/', {
          credentials: 'include'
        }).then(res => res.json()).then((body) => {
          console.log(body);
        });
        clearInterval(interval);
      }
    }, 500);
  }
}

export default withStyles(s)(Login);
