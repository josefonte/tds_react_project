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
    viajar: false,
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
        };
      case 'FETCH_TRAILS_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case 'COMECEI_A_VIAJAR':
        return {
          ...state,
          loading: false,
          viajar: true,
        };
      case 'ACABEI_DE_VIAJAR':
        return {
          ...state,
          viajar:false,
        };
      default:
        return state;
    }
  };
  
  export default trailsReducer;
  