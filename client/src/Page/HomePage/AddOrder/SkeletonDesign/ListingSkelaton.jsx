import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
const ListingSkelaton = () => {
  const rows = 1;
  return (
    <div className="w-100 table-resposive mt-2">
      <table className="w-100 border rounded-2 table table-striped ">
        <tbody className="gap-3">
          {Array.from({ length: rows }, (_, ind) => (
            <tr className=" p-0" key={ind}>
              <td className="px-2 py-0  " style={{width:"15%"}}>
                <Skeleton
                  // variant="squrae"
                  width={100}
                  height={170}
                  className=""
                />
              </td>
              <td className="px-2" style={{width:"40%"}}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "25px" }}
                  width={100}
                />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "30px" }}
                  width="100%"
                />
                <div className="d-flex">
                  <Skeleton
                    variant="circular"
                    width={35}
                    height={35}
                    className="mx-1"
                  />
                  <Skeleton
                    variant="circular"
                    width={35}
                    height={35}
                    className="mx-1"
                  />
                  <Skeleton
                    variant="circular"
                    width={35}
                    height={35}
                    className="mx-1"
                  />
                  <Skeleton
                    variant="circular"
                    width={35}
                    height={35}
                    className="mx-1"
                  />
                </div>
              </td>
              <td className="px-2" style={{width:"30%"}}>
                <Skeleton
                  variant="squrae"
                  width="100%"
                  height={130}
                  className="mt-1"
                />
              </td>
              <td className="px-2" style={{width:"10%"}}>
                <Skeleton
                  variant="squrae"
                  width="90%"
                  height={80}
                  className="mt-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListingSkelaton;
