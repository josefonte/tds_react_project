import { Dispatch } from 'redux';
import { Edge, Media, Pin, RelatedPin, RelatedTrail, Trail } from './../model/model'; // Adjust the import path as needed
import database from './../model/database'; // Adjust the import path as needed

export const fetchTrailsRequest = () => {
  console.log('Dispatching fetchTrailsRequest action...');
  return {
    type: 'FETCH_TRAILS_REQUEST',
  };
};

export const fetchTrailsSuccess = () => {
  console.log('Dispatching fetchTrailsSuccess action');
  return {
    type: 'FETCH_TRAILS_SUCCESS',
  };
};

export const fetchTrailsFailure = (error: any) => {
  console.log('Dispatching fetchTrailsFailure action with error:', error);
  return {
    type: 'FETCH_TRAILS_FAILURE',
    payload: error,
  };
};

export const aViajar = () => {
  console.log('Dispatching aViajar action...');
  return {
    type: 'COMECEI_A_VIAJAR'
  };
};


export const acabeiViajar = () => {
  console.log('Dispatching aViajar action (end)...');
  return {
    type: 'ACABEI_DE_VIAJAR'
  };
};




export const fetchTrails = () => {
  console.log("FUI CHAMADO (Colocar Informação na DB)");
  return async (dispatch: Dispatch) => {
    dispatch(fetchTrailsRequest());
    try {
      const response = await fetch('https://39b6-193-137-92-72.ngrok-free.app/trails'); 
      const trailsData = await response.json();

      // Get existing trail IDs from the database
      const existingTrails = await database.collections.get<Trail>('trails').query().fetch();
      const existingTrailIds = existingTrails.map(trail => trail.trailId);

      // Insert new trails into the database
      await database.write(async () => {
        // Insert each trail into the appropriate table
        for (const trailData of trailsData) {

          // Use the database instance to create a new Trail record
          if (!existingTrailIds.includes(trailData.id)) {

                const newTrail = await database.collections.get<Trail>('trails').create((newTrail: any) => {
                    newTrail.trailId = trailData.id;
                    newTrail.trailName = trailData.trail_name;
                    newTrail.trailDesc = trailData.trail_desc;
                    newTrail.trailDuration = trailData.trail_duration;
                    newTrail.trailDifficulty = trailData.trail_difficulty;
                    newTrail.trailImg = trailData.trail_img;
                });

                for (const relatedTrail of trailData.rel_trail) {
                  await database.collections.get<RelatedTrail>('related_trails').create((relTrail: any) => {
                    relTrail.value = relatedTrail.value;
                    relTrail.attrib = relatedTrail.attrib;
                    relTrail.trail.set(newTrail);
                  });
                }

                for (const edgeData of trailData.edges) {
                  const newEdge = await database.collections.get<Edge>('edges').create((edge: any) => {
                    edge.edgeId = edgeData.id;
                    edge.edgeTransport = edgeData.edge_transport;
                    edge.edgeDuration = edgeData.edge_duration;
                    edge.edgeDesc = edgeData.edge_desc;
                    edge.trail = edgeData.edge_trail;
                    edge.edgeStartId = edgeData.edge_start.id;
                    edge.edgeEndId = edgeData.edge_end.id;      
                  });
                   

                  for (const pinData of [edgeData.edge_start, edgeData.edge_end]) {
                    const newPinn = {
                      pinId: pinData.id,
                      pinName: pinData.pin_name,
                      pinDesc: pinData.pin_desc,
                      pinLat: pinData.pin_lat,
                      pinLng: pinData.pin_lng,
                      pinAlt: pinData.pin_alt,
                      trail: trailData.id,
                    };
                    const newPin = await database.collections.get<Pin>('pins').create((pin: any) => {
                      pin.pinId = pinData.id;
                      pin.pinName = pinData.pin_name;
                      pin.pinDesc = pinData.pin_desc;
                      pin.pinLat = pinData.pin_lat;
                      pin.pinLng = pinData.pin_lng;
                      pin.pinAlt = pinData.pin_alt;
                      pin.trail = trailData.id;                      
                    });

                    for (const relPinData of pinData.rel_pin || []) {
                      await database.collections.get<RelatedPin>('related_pins').create((relPin: any) => {
                        relPin.value = relPinData.value;
                        relPin.attrib = relPinData.attrib;
                        relPin.pin.set(newPin);
                      });
                    }

                    for (const mediaData of pinData.media || []) {
                      await database.collections.get<Media>('media').create((media: any) => {
                        media.mediaId = mediaData.id;
                        media.mediaFile = mediaData.media_file;
                        media.mediaType = mediaData.media_type;
                        media.pin = mediaData.media_pin;
                      });
                    }
                  }
                }
          }
        }
    });
      dispatch(fetchTrailsSuccess());
    } catch (error) {
      dispatch(fetchTrailsFailure(error));
    }
  };
};
