import { Dispatch } from 'redux';
import { Edge, Media, Pin, RelatedPin, RelatedTrail, Trail } from './../model/model'; // Adjust the import path as needed
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

export const createEdgeSuccess = (edges: Edge[]) => ({
  type: 'FETCH_EDGE_SUCCESS',
  payload: edges,
});

export const createPinSuccess = (pins: Pin[]) => ({
  type: 'FETCH_PIN_SUCCESS',
  payload: pins,
});

export const createMediaSuccess = (medias: Media[]) => ({
  type: 'FETCH_MEDIA_SUCCESS',
  payload: medias,
});

export const fetchAllSuccess = (data: Array<Array<Media | Trail | Edge | Pin>>) => ({
  type: 'FETCH_ALL_THINGS_SUCCESS',
  payload: data,
});



export const fetchTrails = () => {
  return async (dispatch: Dispatch) => {
    dispatch(fetchTrailsRequest());
    try {
      const response = await fetch('https://39b6-193-137-92-72.ngrok-free.app/trails'); 
      const trailsData = await response.json();

      // Get existing trail IDs from the database
      const existingTrails = await database.collections.get<Trail>('trails').query().fetch();
      const existingTrailIds = existingTrails.map(trail => trail.trailId);
      const edgess : Edge [] = [];
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
                    edgess.push(newEdge);         
                  });

                  for (const pinData of [edgeData.edge_start, edgeData.edge_end]) {
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

      const transformedTrails = trailsData.map((trailData: { id: any; trail_name: any; trail_desc: any; trail_duration: any; trail_difficulty: any; trail_img: any; }) => ({
        trailId: trailData.id,
        trailName: trailData.trail_name,
        trailDesc: trailData.trail_desc,
        trailDuration: trailData.trail_duration,
        trailDifficulty: trailData.trail_difficulty,
        trailImg: trailData.trail_img,
      }));

      console.log("Dispatch!");
      const pins = await database.collections.get<Pin>('pins').query().fetch();
      const medias = await database.collections.get<Media>('media').query().fetch();
      const edges = await database.collections.get<Edge>('edges').query().fetch();
      //dispatch(fetchTrailsSuccess(transformedTrails));
      //dispatch(createEdgeSuccess(edges));
      //dispatch(createPinSuccess(pins));
      //dispatch(createMediaSuccess(medias));
      const megaArray : Array<Array<Media | Trail | Edge | Pin>> = [];
      megaArray.push(transformedTrails);
      megaArray.push(edges);
      megaArray.push(pins);
      megaArray.push(medias);

      dispatch(fetchAllSuccess(megaArray));
      
    } catch (error) {
      dispatch(fetchTrailsFailure(error));
    }
  };
};
