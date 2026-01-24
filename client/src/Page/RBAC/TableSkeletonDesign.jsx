import { Skeleton } from "@mui/material";
import React from "react";

const RoleSkelaton = () => {
  const rows = 3;
  return (
    <div>
      {Array.from({ length: rows }, (_, ind) => (
        <tr className="pt-4 pb-4 " key={ind}>
          <td className="d-flex">
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={50} />
          </td>
          <td>
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={50} />
          </td>
          <td>
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={50} />
          </td>
          <td>
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={50} />
          </td>
          <td>
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={50} />
          </td>
        </tr>
      ))}
    </div>
  );
};

export default RoleSkelaton;
