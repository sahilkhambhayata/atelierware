import { axiosClient } from "./../../axios/axios";
import { debounce } from "lodash";

export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getFabricDetails = (data) => {

  return {
    type: "GET_FABRIC_Data",
    payload: data,
  };
};

export const FabricNoDAtaFound = (data) => {
  return {
    type: "FABRIC_NO_DATA",
    payload: data.data,
  };
};

export const getFebricSearchDetailsAsyncData = (searchService, serviceId, ak) => {

  return (dispatch) => {
    dispatch(loading());
    const p = 1;
    const l = 5;
    const token = localStorage.getItem("token");

    axiosClient
      .get(
        `/oms/v1/searchFabOrAcc?p=${p}&l=${l}&searchString=${searchService}&ak=${ak}`,
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {

        dispatch(getFabricDetails(res.data));
      })
      .catch((err) => {

        dispatch(FabricNoDAtaFound({ data: true }));
      });
  };
};


export const createDebouncedSearchFabric = () =>
  debounce((dispatch, searchService, serviceId, ak) => {
    dispatch(getFebricSearchDetailsAsyncData(searchService, serviceId, ak));
  }, 800);