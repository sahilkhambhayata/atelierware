export const columnReducer = (columnData = "", action) => {
  switch (action.type) {
    case "GET_COLUMN_LIST":
      return action.payload;

    default:
      return columnData;
  }
};
