const initialState = {
  loading: false,
  error: null,
  viajar: false,
  historico: [],
};

const trailsReducer = (state = initialState, action: any) => {
  console.log(initialState.historico);
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
        viajar: true,
      };
    case 'ACABEI_DE_VIAJAR':
      return {
        ...state,
        viajar: false,
      };
    case 'ADICIONEI_AO_HISTORICO_VIAGEM':
      return {
        ...state,
        historico: [...state.historico, action.payload],
        viajar: true,
      };
    default:
      return state;
  }
};

export default trailsReducer;
