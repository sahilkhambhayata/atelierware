import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
const SearchCustomerSkeleton = () => {
  const rows = 5;
  return (
    <div className="w-100 table resposive">
      <table className="w-100 border rounded-2">
        <tbody>
          {Array.from({ length: rows }, (_, ind) => (
            <tr className="w-100 align-items-center" key={ind}>
              <td>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  className="m-1 ms-3"
                />
              </td>
              <td>
                <Skeleton variant="text" sx={{ fontSize: "12px" }} width={50} />
                <Skeleton variant="text" sx={{ fontSize: "10px" }} width={70} />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "10px" }}
                  width={100}
                />
              </td>
              <td className="">
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  className=""
                />
              </td>
              <td className="d-none d-lg-inline-block">
                <Skeleton variant="text" sx={{ fontSize: "16px" }} width={50} />
              </td>
              <td className="d-none d-lg-inline-block">
                <Skeleton variant="text" sx={{ fontSize: "16px" }} width={50} />
              </td>
              <td className="d-none d-lg-inline-block">
                <Skeleton variant="text" sx={{ fontSize: "16px" }} width={50} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SearchCustomerSkeleton;
