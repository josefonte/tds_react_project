const initialState = {
    trails: [],
    edges: [],
    medias: [],
    pins: [],
    loading: false,
    loadingEdge: false,
    loadingMedia: false,
    loadingPin: false,
    error: null,
  };
  
  const trailsReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case 'FETCH_TRAILS_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'FETCH_TRAILS_SUCCESS':
        return {
          ...state,
          loading: false,
          trails: action.payload,
        };
      case 'FETCH_TRAILS_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case 'FETCH_EDGE_SUCCESS':
        return {
          ...state,
          loadingEdge: false,
          edges: action.payload,
        };
      case 'FETCH_MEDIA_SUCCESS':
        return {
          ...state,
          loadingMedia: false,
          medias: action.payload,
        };
      case 'FETCH_PIN_SUCCESS':
        return {
          ...state,
          loadingPin: false,
          pins: action.payload,
        };
      case 'FETCH_ALL_THINGS_SUCCESS':
        return {
          ...state,
          loading: false,
          trails: action.payload[0],
          edges: action.payload[1],
          pins: action.payload[2],
          medias: action.payload[3],
        };
      default:
        return state;
    }
  };
  
  export default trailsReducer;
  