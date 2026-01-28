import { axiosClient } from "./../../axios/axios";
import { debounce } from "lodash";

export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getCustomerDetails = (data) => {
  return {
    type: "GET_CUSTOMER_DETAILS",
    payload: data,
  };
};

export const getCustomerDetailsAsyncData = (search, ak) => {
  return (dispatch) => {
    dispatch(loading());
    const p = 1;
    const l = 50;
    const token = localStorage.getItem("token");

    axiosClient
      .get(
        `/crm/v1/searchCustomers?search=${search}&page=${p}&limit=${l}&apiKey=${ak}`,
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        dispatch(getCustomerDetails(res.data));
      })
      .catch((err) => {
        dispatch(getCustomerDetails({}));
      });
  };
};

export const createDebouncedSearchCustomer = () =>
  debounce((dispatch, search, ak) => {
    dispatch(getCustomerDetailsAsyncData(search, ak));
  }, 500);

export const getSingleCustomer = (customer_id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const data = await axiosClient.get(`/crm/v1/getCustomers/${customer_id}`, {
      headers: {
        token: token,
      },
    });

    dispatch({ type: "GET_SINGLE_CUSTOMER", payload: data.data });
    return data.data;
  } catch (error) {
    // console.log(error);
  }
};

export const addCustomer = (data, image, BU_Id, companyId, BranchId) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const formdata = {
        AccName: data.name,
        Address: data.address,
        CountryID: Number(data.countryId),
        MobileNo: data.mobileNo,
        dialcode: data.dialcode,
        Email: data.email,
        BranchId: Number(BranchId),
        CompanyId: Number(companyId),
        BirthDate: data.BODDate
          ? new Date(data.BODDate).toISOString().split("T")[0]
          : null,
        AnniDate: data.AniDate
          ? new Date(data.AniDate).toISOString().split("T")[0]
          : null,
        CustTypeId: Number(data.CustTypeId),
        CustType: data.selectedStatus,
        VatTNo: data.vatTno ? data.vatTno : "",
        profile_img: image.profileImg,
        profile_front: image.frontImg,
        profile_back: image.backImg,
        profile_side: image.rightImg,
      };
      // const formdata = new FormData();

      const response = await axiosClient.post(
        `/crm/v1/addCustomer?ak=${BU_Id}`,
        formdata,
        {
          headers: {
            token: token,
          },
        }
      );

      dispatch({ type: "ADD_CUSTOMER", payload: response.data });
      return response.data;
    } catch (error) {
      // console.log(error);
    }
  };
};

export const UpdateCustomer = (
  data,
  image,
  customer_id,
  companyId,
  BranchId
) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      const formdata = {
        // AccountId: customer_id,
        AccName: data.name,
        Address: data.address,
        CountryID: Number(data.countryId),
        MobileNo: data.mobileNo,
        dialcode: data.dialcode,
        Email: data.email,
        BranchId: Number(BranchId),
        CompanyId: Number(companyId),
        BirthDate: data.BODDate
          ? new Date(data.BODDate).toISOString().split("T")[0]
          : null,
        AnniDate: data.AniDate
          ? new Date(data.AniDate).toISOString().split("T")[0]
          : null,
        CustTypeId: Number(data.CustTypeId),
        CustType: data.selectedStatus,
        VatTNo: data.vatTno ? data.vatTno : "",
        profile_img: image.profileImg,
        profile_front: image.frontImg,
        profile_back: image.backImg,
        profile_side: image.rightImg,
      };

      const response = await axiosClient.post(
        `/crm/v1/updateCustomers/${customer_id}`,
        formdata,
        {
          headers: {
            token: token,
          },
        }
      );

      return response.data;
      // dispatch({ type: "ADD_CUSTOMER", payload: data.data });
    } catch (error) {
      // console.log(error);
    }
  };
};
