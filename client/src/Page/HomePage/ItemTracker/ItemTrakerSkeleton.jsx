import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function ItemTrakerSkeleton({ rows }) {

  return (
    <>

      <div className="overflow-y-scroll">
        <table className=" ">
          <thead>
            <tr className="pt-5 pt-5 text-center">
              <th>
                <Skeleton
                  variant="rounded"
                  width={30}
                  height={30}
                  className="m-1 ms-3"
                />
              </th>
              <th>
                {" "}
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "2rem" }}
                  width={100}
                />
              </th>
              <th>
                {" "}
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "2rem" }}
                  width={120}
                />
              </th>
              <th>
                {" "}
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "2rem" }}
                  width={130}
                />
              </th>
              <th>
                {" "}
                <Skeleton variant="text" sx={{ fontSize: "2rem" }} width={90} />
              </th>
              <th>
                {" "}
                <Skeleton variant="text" sx={{ fontSize: "2rem" }} width={90} />
              </th>
              <th>
                {" "}
                <Skeleton variant="text" sx={{ fontSize: "2rem" }} width={80} />
              </th>
              <th>
                {" "}
                <Skeleton variant="text" sx={{ fontSize: "2rem" }} width={90} />
              </th>
              <th>
                {" "}
                <Skeleton variant="text" sx={{ fontSize: "2rem" }} width={80} />
              </th>
              <th>
                {" "}
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "2rem" }}
                  width={100}
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, ind) => (
              <tr className="pt-4 pb-4 " key={ind}>
                {/* service1 */}
                <td className="d-flex">
                  <Skeleton
                    variant="circular"
                    width={15}
                    height={15}
                    className="m-1"
                  />
                  <Skeleton
                    variant="rounded"
                    width={20}
                    height={20}
                    className="m-1"
                  />
                </td>
                {/* service2 */}
                <td>
                  <Skeleton variant="circular" height={30} width={30} />
                  <Skeleton variant="circular" height={30} width={30} />
                  <Skeleton variant="circular" height={30} width={30} />
                </td>

                {/* description */}
                <td>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "0.8rem" }}
                    width={50}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "0.8rem" }}
                    width={100}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "0.8rem" }}
                    width={80}
                  />
                </td>

                {/* customer */}
                <td className="pt-4 pb-4  d-flex align-items-center justify-content-around">
                  <div className="">
                    <Skeleton variant="circular" width={30} height={30} />
                  </div>
                  <div>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "0.8rem" }}
                      width={70}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "0.8rem" }}
                      width={80}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "0.8rem" }}
                      width={80}
                    />
                  </div>
                </td>

                {/* commitment */}
                <td className=" justify-content-around">
                  <div className="d-flex align-items-center ">
                    <Skeleton
                      variant="rounded"
                      width={20}
                      height={20}
                      className="m-1"
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={100}
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <Skeleton
                      variant="rounded"
                      width={20}
                      height={20}
                      className="m-1"
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={100}
                    />
                  </div>
                </td>

                {/* status */}
                <td className="">
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={100}
                    height={60}
                  />
                </td>

                {/* value */}
                <td className="">
                  <div className="d-flex align-items-center">
                    <Skeleton
                      variant="circular"
                      width={30}
                      height={30}
                      className="m-2"
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={100}
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    <Skeleton
                      variant="circular"
                      width={30}
                      height={30}
                      className="m-2"
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={100}
                    />
                  </div>
                </td>

                {/* paid */}
                <td className="">
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1rem" }}
                    width={30}
                  />
                </td>

                {/* balance */}
                <td className="">
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.5rem" }}
                    width={70}
                    className="mb-1"
                  />
                  <Skeleton variant="text" width={100} height={60} />
                </td>

                {/* balance */}
                <td className="">
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "1.5rem" }}
                    width={70}
                    className="mb-1"
                  />
                  <Skeleton variant="text" width={100} height={60} />
                </td>
                {/* more */}
                <td className="">
                  <div className="d-flex mb-1">
                    <Skeleton
                      variant="rounded"
                      width={20}
                      height={20}
                      className="m-1"
                    />
                    <Skeleton
                      variant="rounded"
                      width={20}
                      height={20}
                      className="m-1"
                    />
                    <Skeleton
                      variant="rounded"
                      width={20}
                      height={20}
                      className="m-1"
                    />
                  </div>
                  <Skeleton variant="text" width={100} height={60} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
