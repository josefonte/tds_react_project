// Import necessary modules
import { Trail, Edge, Pin, Media, RelatedTrail, RelatedPin } from './model'; // Import your model classes here
import database from './database'; // Import your database instance here
import { fetchDataFromAPI } from './apiService'; // Import your API service function here

// Define the function to fetch data from API and insert into the database
// Define the function to fetch data from API and insert into the database
export async function fetchDataAndInsertIntoDB() {
  try {
    // Fetch data from API
    const trailsData = await fetchDataFromAPI();
    const existingTrails = await database.collections.get<Trail>('trails').query().fetch();
    const existingTrailIds = existingTrails.map(trail => trail.trailId);

    // Start a database transaction
    await database.write(async () => {
        // Insert each trail into the appropriate table
        for (const trailData of trailsData) {

          // Use the database instance to create a new Trail record
          if (!existingTrailIds.includes(trailData.id)) {

                const newTrail = await database.collections.get<Trail>('trails').create((newTrail: any) => {
                    console.log(trailData.id);
                    newTrail.trailId = trailData.id;
                    newTrail.trailName = trailData.trail_name;
                    newTrail.trailDesc = trailData.trail_desc;
                    newTrail.trailDuration = trailData.trail_duration;
                    newTrail.trailDifficulty = trailData.trail_difficulty;
                    newTrail.trailImg = trailData.trail_img;
                });

                // Insert related trails
                for (const relatedTrail of trailData.rel_trail) {
                  await database.collections.get<RelatedTrail>('related_trails').create((relTrail: any) => {
                    relTrail.value = relatedTrail.value;
                    relTrail.attrib = relatedTrail.attrib;
                    relTrail.trail.set(newTrail);
                  });
                }

                for (const edgeData of trailData.edges) {
                  const newEdge = await database.collections.get<Edge>('edges').create((edge: any) => {
                    edge.edgeTransport = edgeData.edge_transport;
                    edge.edgeDuration = edgeData.edge_duration;
                    edge.edgeDesc = edgeData.edge_desc;
                    edge.trail.set(newTrail);
                    edge.edgeStartId = edgeData.edge_start.id;
                    edge.edgeEndId = edgeData.edge_end.id;
                  });

                  for (const pinData of [edgeData.edge_start, edgeData.edge_end]) {
                    const newPin = await database.collections.get<Pin>('pins').create((pin: any) => {
                      pin.pinName = pinData.pin_name;
                      pin.pinDesc = pinData.pin_desc;
                      pin.pinLat = pinData.pin_lat;
                      pin.pinLng = pinData.pin_lng;
                      pin.pinAlt = pinData.pin_alt;
                      pin.trail_id = newTrail.trailId;
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
                        media.mediaFile = mediaData.media_file;
                        media.mediaType = mediaData.media_type;
                        media.pin.set(newPin);
                      });
                    }
                  }
                }
          }
        }
    });
    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data into the database:', error);
  }
}
