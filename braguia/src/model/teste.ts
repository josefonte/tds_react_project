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
      

    console.log('Data inserted successfully!');
  } catch (error) {
    console.error('Error inserting data into the database:', error);
  }
}
