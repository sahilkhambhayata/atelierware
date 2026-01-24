export const getGroupTrialDeliveryReducer = (state = {}, action) => {
    switch (action.type) {
      case "GROUP_TRIAL_DELIVERY_DATA":

        return (state = action.payload);
  
      default:
        return state;
    }
  };
  