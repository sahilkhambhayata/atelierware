import React, { useEffect, useState } from "react";
import Icon from "../../../Components/icon/Icon";
import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import Skeleton from "@mui/material/Skeleton";

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions,
  rowsPerPage,
  labelRowsPerPage,
  isClosed,
}) => {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const order = useSelector((state) => state?.orderDetails);
  const item = useSelector((state) => state?.itemDetails);
  const roleData = useSelector((state) => state.roleReducer);
  const userData = useSelector((state) => state.userReducer);

  const searchOrderValue = useSelector(
    (state) => state?.orderDetails?.searchResults
  );

  const itemSearchValue = useSelector((state) => state?.itemDetails.itemSearch);

  const [selectedOptions, setSelectedOptions] = useState(rowsPerPage);

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    
    setSelectedOptions(newRowsPerPage);
    onRowsPerPageChange(newRowsPerPage); // Ensure this function updates your data.
  };

  const location = useLocation();

  const [pathName, setPathName] = useState();
  useEffect(() => {
    setPathName(location.pathname);
  }, [location]);

  // const pathname = location.pathname;

  return (
    <div className="d-flex  custom-pagination align-items-center">
      <div className="row-page-title">{labelRowsPerPage}:</div>
      <div className="select-box">
        <select
          value={selectedOptions}
          onChange={handleRowsPerPageChange}
          className="form-select"
        >
          {rowsPerPageOptions.map((option, index) => (
            <option key={index} value={option}>
              {option === 0 ? "All " : option}
            </option>
          ))}
        </select>
      </div>

      <div className="left-arrow-button">
        <IconButton
          aria-label="previous"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <Icon name="chevron-left" className="left-icon" />
        </IconButton>
      </div>

      
      {pathName == "/dashboard" && !order.isLoader ? (
        isClosed != 6 ? (
          <div className="page-details mx-0 mx-sm-0 ">
            {totalPages == undefined ? (
              <>
                {0} - {0} of {0}
              </>
            ) : selectedOptions === 0 ? (
              <>
                {currentPage + 1} - {order.order.TotalCount} of{" "}
                {order.order.TotalCount}
              </>
            ) : (
              <>
                {currentPage * selectedOptions + 1} -{" "}
                {Math.min(
                  (currentPage + 1) * selectedOptions,
                  order.order.TotalCount
                )}{" "}
                of {order.order.TotalCount}
              </>
            )}
          </div>
        ) : (
          <div className="page-details mx-0 mx-sm-0 ">
            {totalPages == undefined ? (
              <>
                {0} - {0} of {0}
              </>
            ) : selectedOptions === 0 ? (
              <>
                {currentPage + 1} - {searchOrderValue.TotalCount} of{" "}
                {searchOrderValue.TotalCount}
              </>
            ) : (
              <>
                {currentPage * selectedOptions + 1} -{" "}
                {Math.min(
                  (currentPage + 1) * selectedOptions,
                  searchOrderValue.TotalCount
                )}{" "}
                of {searchOrderValue.TotalCount}
              </>
            )}
          </div>
        )
      ) : pathName == "/dashboard" && order.isLoader ? (
        <div className="page-details mx-0 mx-sm-0 d-flex align-items-center">
          <Skeleton variant="rounded" width={30} height={20} className="m-1 " />
          -
          <Skeleton
            variant="rounded"
            width={30}
            height={20}
            className="m-1"
          />{" "}
          of{" "}
          <Skeleton variant="rounded" width={30} height={20} className="m-1" />
        </div>
      ) : pathName == "/item-tracker" && !item.isLoader ? (
        isClosed != 6 ? (
          <div className="page-details mx-0 mx-sm-0 ">
            {totalPages == undefined ? (
              <>
                {0} - {0} of {0}
              </>
            ) : selectedOptions === 0 ? (
              <>
                {currentPage + 1} - {item.item.TotalCount} of{" "}
                {item.item.TotalCount}
              </>
            ) : (
              <>
                {currentPage * selectedOptions + 1} -{" "}
                {Math.min(
                  (currentPage + 1) * selectedOptions,
                  item.item.TotalCount
                )}{" "}
                of {item.item.TotalCount}
              </>
            )}
          </div>
        ) : (
          <div className="page-details mx-0 mx-sm-0 ">
            {totalPages == undefined ? (
              <>
                {0} - {0} of {0}
              </>
            ) : selectedOptions === 0 ? (
              <>
                {currentPage + 1} - {itemSearchValue.TotalCount} of{" "}
                {itemSearchValue.TotalCount}
              </>
            ) : (
              <>
                {currentPage * selectedOptions + 1} -{" "}
                {Math.min(
                  (currentPage + 1) * selectedOptions,
                  itemSearchValue.TotalCount
                )}{" "}
                of {itemSearchValue.TotalCount}
              </>
            )}
          </div>
        )
      ) : pathName == "/item-tracker" && item.isLoader ? (
        <div className="page-details mx-0 mx-sm-0 d-flex align-items-center">
          <Skeleton variant="rounded" width={30} height={20} className="m-1 " />
          -
          <Skeleton
            variant="rounded"
            width={30}
            height={20}
            className="m-1"
          />{" "}
          of{" "}
          <Skeleton variant="rounded" width={30} height={20} className="m-1" />
        </div>
      ) : pathName == "/role" && !roleData.roleLoader ? (
        <div className="page-details mx-0 mx-sm-0 ">
          {totalPages == undefined ? (
            <>
              {0} - {0} of {0}
            </>
          ) : selectedOptions === 0 ? (
            <>
              {currentPage + 1} - {roleData.roleData.TotalCount} of{" "}
              {roleData.roleData.TotalCount}
            </>
          ) : (
            <>
              
              {currentPage * selectedOptions + 1} -{" "}
              {Math.min(
                (currentPage + 1) * selectedOptions,
                roleData.roleData.TotalCount
              )}{" "}
              of {roleData.roleData.TotalCount}
            </>
          )}
        </div>
      ) : pathName == "/role" && roleData.roleLoader ? (
        <div className="page-details mx-0 mx-sm-0 d-flex align-items-center">
          <Skeleton variant="rounded" width={30} height={20} className="m-1 " />
          -
          <Skeleton
            variant="rounded"
            width={30}
            height={20}
            className="m-1"
          />{" "}
          of{" "}
          <Skeleton variant="rounded" width={30} height={20} className="m-1" />
        </div>
      ) : pathName == "/user" && !userData.userLoader ? (
        <div className="page-details mx-0 mx-sm-0 ">
          {totalPages == undefined ? (
            <>
              {0} - {0} of {0}
            </>
          ) : selectedOptions === 0 ? (
            <>
              {currentPage + 1} - {userData.userData.TotalCount} of{" "}
              {userData.userData.TotalCount}
            </>
          ) : (
            <>
             
              {currentPage * selectedOptions + 1} -{" "}
              {Math.min(
                (currentPage + 1) * selectedOptions,
                userData.userData.TotalCount
              )}{" "}
              of {userData.userData.TotalCount}
            </>
          )}
        </div>
      ) : pathName == "/user" && userData.userLoader ? (
        <div className="page-details mx-0 mx-sm-0 d-flex align-items-center">
          <Skeleton variant="rounded" width={30} height={20} className="m-1 " />
          -
          <Skeleton
            variant="rounded"
            width={30}
            height={20}
            className="m-1"
          />{" "}
          of{" "}
          <Skeleton variant="rounded" width={30} height={20} className="m-1" />
        </div>
      ) : (
        <></>
      )}

      <div className="right-arrow-button">
        <IconButton
          aria-label="next"
          onClick={() => handlePageClick(currentPage + 1)}
          // disabled={
          //   (currentPage + 1) * selectedOptions >= totalPages ||
          //   selectedOptions === 0
          // }
          disabled={currentPage === totalPages - 1}
        >
          <Icon name="chevron-right" className="right-icon" />
        </IconButton>
      </div>
    </div>
  );
};

export default CustomPagination;
