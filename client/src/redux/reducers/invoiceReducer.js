const initialState = {
  invoiceData: {},
  isLoader: false,
};

export const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_INVOICE_DATA":
     
      return {
        ...state,
        invoiceData: { ...action.payload },
        isLoader: false,
      };

    case "IS_LOADING":
      return {
        ...state,
        isLoader: true,
      };
    default:
      return state;
  }
};
