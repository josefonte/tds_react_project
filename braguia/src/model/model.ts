import { Database, Model } from '@nozbe/watermelondb'
import { field, relation } from '@nozbe/watermelondb/decorators'


class Trail extends Model {
  static table = 'trails'

  @field('trail_id') trailId !: number
  @field('trail_name') trailName!: string
  @field('trail_desc') trailDesc!: string
  @field('trail_duration') trailDuration!: number
  @field('trail_difficulty') trailDifficulty!: string
  @field('trail_img') trailImg!: string


}

class Edge extends Model {
  static table = 'edges'

  @field('edge_id') edgeId !: number
  @field('edge_transport') edgeTransport!: string
  @field('edge_duration') edgeDuration!: number
  @field('edge_desc') edgeDesc!: string
  @field('edge_trail') trail!: number
  @field('edge_start_id') edgeStartId!: string
  @field('edge_end_id') edgeEndId!: string
}

class Pin extends Model {
  static table = 'pins'

  @field('pin_id') pinId !: number
  @field('pin_name') pinName!: string
  @field('pin_desc') pinDesc!: string
  @field('pin_lat') pinLat!: number
  @field('pin_lng') pinLng!: number
  @field('pin_alt') pinAlt!: number
  @field('pin_trail') trail!: number
}

class Media extends Model {
  static table = 'media'

  @field('media_file') mediaFile!: string
  @field('media_type') mediaType!: string
  @relation('pins', 'pin_id') pin!: Pin
}

class RelatedTrail extends Model {
  static table = 'related_trails'

  @field('value') value!: string
  @field('attrib') attrib!: string
  @relation('trails', 'trail_id') trail!: Trail
}

class RelatedPin extends Model {
  static table = 'related_pins'

  @field('value') value!: string
  @field('attrib') attrib!: string
  @relation('pins', 'pin_id') pin!: Pin
}

export {Trail, Edge, Pin, Media, RelatedPin, RelatedTrail}