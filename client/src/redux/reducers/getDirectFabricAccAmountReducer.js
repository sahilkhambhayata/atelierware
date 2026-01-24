const initialState = {
    totalFabricAmount: 0,
    totalAccessoriesAmount: 0,
  };
  
export const getDirectFabricAccAmountReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_TOTAL_FABRIC_AMOUNT':
        return { ...state, totalFabricAmount: action.payload };
  
      case 'SET_TOTAL_ACCESSORIES_AMOUNT':
        return { ...state, totalAccessoriesAmount: action.payload };
  
      default:
        return state;
    }
  };
  
//   export default reducer;