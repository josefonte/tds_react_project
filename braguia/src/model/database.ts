import { Platform } from 'react-native'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import { Trail, Edge, Pin, Media, RelatedTrail, RelatedPin } from './model' 

const adapter = new SQLiteAdapter({
  schema,
  jsi: true, 
  onSetUpError: error => {
    // Handle setup error if needed
  }
})

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    Trail,
    Edge,
    Pin,
    Media,
    RelatedTrail,
    RelatedPin
  ],
})

export default database
