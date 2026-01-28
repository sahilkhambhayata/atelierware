import { axiosClient } from "./../../axios/axios";

export const statusUpdate = (SId, nextSId, TOrdDtId, UserId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const data1 = await axiosClient.post(
        `/oms/v1/updateitemStatus`,
        {
          SId: Number(SId),
          nextSId: Number(nextSId),
          TOrdDtId: Number(TOrdDtId),
          UserId: Number(UserId),
        },
        {
          headers: {
            token: `${token}`,
          },
        }
      );

      return data1.data;
    } catch (error) {
      // console.log(error);
    }
  };
};
