import { axiosClient } from "./../../axios/axios";

export const sendPdf = (id, file) => {
  return async (dispatch) => {

    
    try {
      const token = localStorage.getItem("token");

      const data1 = await axiosClient.post(`/crm/v1/getpdf?tordhdid=${id}`, file, {
        headers: {
          token: `${token}`,
        },
      });

    
      // return data1.data;
      // dispatch({ type: "ADD_FLATE_EXCEL", payload: data1.data });
    } catch (error) {
      // console.log(error);
    }
  };
};
