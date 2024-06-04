import { Dispatch } from 'redux';
import { Trail } from './../model/model'; // Adjust the import path as needed
import database from './../model/database'; // Adjust the import path as needed

export const fetchTrailsRequest = () => ({
  type: 'FETCH_TRAILS_REQUEST',
});

export const fetchTrailsSuccess = (trails: Trail[]) => ({
  type: 'FETCH_TRAILS_SUCCESS',
  payload: trails,
});

export const fetchTrailsFailure = (error: any) => ({
  type: 'FETCH_TRAILS_FAILURE',
  payload: error,
});

export const fetchTrails = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTrailsRequest());
    try {
      const fetchedTrails = await database.collections.get<Trail>('trails').query().fetch();
      dispatch(fetchTrailsSuccess(fetchedTrails));
    } catch (error) {
      dispatch(fetchTrailsFailure(error));
    }
  };
};
