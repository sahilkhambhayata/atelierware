export const getPaymentData = (cash, wallet, bank) => {
 
  return async (dispatch) => {
    const combinedObject = {
      cashDetails: cash,
      walletDetails: wallet,
      bankDetails: bank,
    };

    
    dispatch({ type: "ALL_AMOUNT_DATA", payload: combinedObject });
  };
};
