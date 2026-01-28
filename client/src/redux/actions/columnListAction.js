import { axiosClient } from "./../../axios/axios";
export const loading = () => {
  return {
    type: "IS_LOADING",
  };
};

export const getColumnList = (data) => {
  return {
    type: "GET_COLUMN_LIST",
    payload: data,
  };
};

export const getColumnListData = (id, tableName) => {
  return async (dispatch) => {
    dispatch(loading());

    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.post(
        `/oms/v1/user_tbl_field`,
        {
          userId: id,
          tableName: tableName,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      if(response.data.success){
        dispatch(getColumnList(response.data));
        return response.data
      }
      else{
        dispatch(getColumnList({}));
        return response.data
      }
      
    } catch (error) {
      // console.log(error);
      return false
    }
    // .then((res) => {
    //   dispatch(getColumnList(res.data));
    // })
    // .catch((err) => {
    //   dispatch(getColumnList({}));
    // });
  };
};

export const updateColumnList = (data) => {
  return {
    type: "UPDATE_COLUMN_LIST",
    payload: data,
  };
};

export const updateColumnListData = (id, tableName, tableFields) => {
  if (!Array.isArray(tableFields)) {
    tableFields = [];
  }
  return async (dispatch) => {
    const tableFieldsString = tableFields.join(", ");

    const token = localStorage.getItem("token");
    try {
      const data = await axiosClient.put(
        `/oms/v1/update_user_tbl_field`,
        {
          userId: id,
          tableName: tableName,
          tableFields: tableFieldsString,
        },
        {
          headers: {
            token: token,
          },
        }
      );
    } catch (error) {
      // console.log(error);
    }
  };
};
