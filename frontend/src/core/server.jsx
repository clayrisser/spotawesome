import 'babel-polyfill';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import UniversalRouter from 'universal-router';
import express from 'express';
import path from 'path';
import PrettyError from 'pretty-error';
import App from './App';
import Html from './Html';
import config from '../config';
import { withLabel as logger, noLabel as loggerNoLabel } from '../../tools/logger';
import routes from '../routes';
import configureStore from '../redux/configureStore';
import assets from './assets';
import ErrorReporter from './ErrorReporter';
import { Provider } from 'react-redux';

class Server {
  app = express();
  css = new Set();
  context = {
    insertCss: (...styles) => styles.forEach(style => this.css.add(style._getCss())),
    store: configureStore()
  };

  constructor() {
    this.preMiddleware();
    this.routes();
    this.postMiddleware();
    this.app.listen(config.environment.port, () => {
      console.log(`The server is running at http://localhost:${config.environment.port}/`);
    });
  }

  preMiddleware() {
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  routes() {
    this.app.get('*', async (req, res, next) => {
      try {
        let router = new UniversalRouter(routes);
        let route = await router.resolve({
          path: req.path,
          query: req.query,
          context: this.context
        });
        if (route.redirect) {
          res.redirect(route.status || 302, route.redirect);
          return;
        }
        let children = ReactDOMServer.renderToString(<Provider store={this.context.store}>
          <App context={this.context}>
            {route.component}
          </App>
        </Provider>);
        let scripts = ['./client.js'];
        let html = ReactDOMServer.renderToStaticMarkup(<Html scripts={scripts} css={[...this.css].join('')}>{children}</Html>);
        return res.send(`<!doctype html>${html}`);
      } catch (err) {
        next(err);
      }
    });
  }

  postMiddleware() {
    this.app.use((err, req, res, next) => {
      let prettyError = new PrettyError();
      prettyError.skipNodeFiles();
      prettyError.skipPackage('express');
      loggerNoLabel.error(prettyError.render(err));
      let title = 'Internal Server Error';
      let children = ReactDOMServer.renderToString(<ErrorReporter title={title} error={err} />);
      let html = ReactDOMServer.renderToStaticMarkup(<Html title={title} css={[...this.css].join('')}>
        {children}
      </Html>);
      res.status(err.status || 500);
      res.send(`<!doctype html>${html}`);
    });
  }
}

new Server();
