const initialState = {
  // Initial state properties
};

export const getDiscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DISCRIPTION":
      return action.payload || null;

    default:
      return state;
  }
};
