import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import initialState from './initialState';

export default () => {
  let middleware = applyMiddleware(reduxThunk);
  if (process.env.BROWSER) {
    let composeEnhancers = composeWithDevTools({});
    middleware = composeEnhancers(middleware);
  }
  return createStore(rootReducer, initialState, middleware);
};

export const mapStateToProps = (state) => {
  return {
    location: state.location
  };
};
