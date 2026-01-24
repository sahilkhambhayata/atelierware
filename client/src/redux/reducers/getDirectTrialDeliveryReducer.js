export const getDirectTrialDeliveryReducer = (state = {}, action) => {
    switch (action.type) {
      case "TRIAL_DELIVERY_DATA":

        return (state = action.payload);
  
      default:
        return state;
    }
  };
  