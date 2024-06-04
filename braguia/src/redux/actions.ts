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
      // Fetch data from the API
      const response = await fetch('https://39b6-193-137-92-72.ngrok-free.app/trails'); // Replace with your API endpoint
      const trailsData = await response.json();

      // Get existing trail IDs from the database
      const existingTrails = await database.collections.get<Trail>('trails').query().fetch();
      const existingTrailIds = existingTrails.map(trail => trail.trailId);



      // Insert new trails into the database
      await database.write(async () => {
        for (const trailData of trailsData) {
          if (!existingTrailIds.includes(trailData.id)) {
            await database.collections.get<Trail>('trails').create((newTrail: any) => {
              newTrail.trailId = trailData.id;
              newTrail.trailName = trailData.trail_name;
              newTrail.trailDesc = trailData.trail_desc;
              newTrail.trailDuration = trailData.trail_duration;
              newTrail.trailDifficulty = trailData.trail_difficulty;
              newTrail.trailImg = trailData.trail_img;
            });
          }
        }
      });
      const transformedTrails = trailsData.map((trailData: { id: any; trail_name: any; trail_desc: any; trail_duration: any; trail_difficulty: any; trail_img: any; }) => ({
        trailId: trailData.id,
        trailName: trailData.trail_name,
        trailDesc: trailData.trail_desc,
        trailDuration: trailData.trail_duration,
        trailDifficulty: trailData.trail_difficulty,
        trailImg: trailData.trail_img,
      }));
      
      dispatch(fetchTrailsSuccess(transformedTrails));
      
      //console.log(trailsData)
      //dispatch(fetchTrailsSuccess(trailsData));
    } catch (error) {
      dispatch(fetchTrailsFailure(error));
    }
  };
};
