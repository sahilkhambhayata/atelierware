export const getGroupTrialDeliveryData = (data) => {

    return async (dispatch) => {
      dispatch({ type: "GROUP_TRIAL_DELIVERY_DATA", payload: data });
    };
  };
