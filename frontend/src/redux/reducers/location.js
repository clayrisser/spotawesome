import { UPDATE_LOCATION } from '../constants';
import _ from 'lodash';
import history from '../../core/history';

export default (state = {}, action) => {
  switch(action.type) {
  case UPDATE_LOCATION:
    return _.assign({}, state, action.payload);
  default:
    return state;
  }
}
