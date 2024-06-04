const initialState = {
    trails: [],
    loading: false,
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
      default:
        return state;
    }
  };
  
  export default trailsReducer;
  