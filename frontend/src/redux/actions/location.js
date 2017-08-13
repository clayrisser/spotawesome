import { UPDATE_LOCATION } from '../constants';

export function updateLocation(location) {
  return {
    type: UPDATE_LOCATION,
    payload: location
  };
}
