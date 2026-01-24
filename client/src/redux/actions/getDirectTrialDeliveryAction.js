export const getDirectTrialDeliveryData = (data) => {
    return async (dispatch) => {
      dispatch({ type: "TRIAL_DELIVERY_DATA", payload: data });
    };
  };
  