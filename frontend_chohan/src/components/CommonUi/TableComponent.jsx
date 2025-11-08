// // // import { Pagination, Table } from "antd";
// // // import { useEffect, useState } from "react";
// // // import { CSVLink } from "react-csv";
// // // import { useDispatch } from "react-redux";
// // // import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown";
// // // import FilterInput from "./FilterInput";
// // // import DetailBookingEntry from "../entry/bookingEntry/detailBookingEntry";

// // // const TableComponent = ({
// // //   columns,
// // //   list,
// // //   total,
// // //   loading,
// // //   csvFileName,
// // //   paginatedThunk,
// // //   paginationStatus,
// // //   deleteManyThunk,
// // //   children,
// // //   query,
// // //   onEdit,
// // //   scrollX,
// // //   FilterOptionList,
// // //   expandedRow,
// // // }) => {
// // //   // const [selectedRowKeys, setSelectedRowKeys] = useState([]);

// // //   const dispatch = useDispatch();

// // //   // const onSelectChange = (newSelectedRowKeys) => {
// // //   //   setSelectedRowKeys(newSelectedRowKeys);
// // //   // };
// // //   // const rowSelection = {
// // //   //   selectedRowKeys,
// // //   //   onChange: onSelectChange,
// // //   // };

// // //   const fetchData = (page, count) => {
// // //     dispatch(
// // //       paginatedThunk({
// // //         ...query,
// // //         status: paginationStatus ? paginationStatus : true,
// // //         page,
// // //         count,
// // //       })
// // //     );
// // //   };

// // //   // column select
// // //   const [columnsToShow, setColumnsToShow] = useState([]);

// // //   useEffect(() => {
// // //     setColumnsToShow(columns);
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);
// // //   const columnsToShowHandler = (val) => {
// // //     setColumnsToShow(val);
// // //   };
// // //   const handleEdit = (record) => {
// // //     // Call the onEdit prop when edit is clicked
// // //     if (onEdit) {
// // //       onEdit(record);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <div className="mt-2">
// // //         <div className="pb-3">
// // //           <div className="flex flex-col items-center justify-between w-full gap-2 dark:text-yellow-50 md:flex-row">
// // //             {csvFileName && (
// // //               <div className="flex gap-2">
// // //                 {/* <div className="px-4 py-1 text-white border rounded-md bg-black/80">
// // //                   <CSVLink
// // //                     data={list ? list : ""}
// // //                     className="px-0 py-1 mr-2 text-xs text-white rounded md:text-base "
// // //                     filename={csvFileName}
// // //                   >
// // //                     Download CSV
// // //                   </CSVLink>
// // //                 </div> */}
// // //                 {/* <ColVisibilityDropdown
// // //                   options={columns}
// // //                   columns={columns}
// // //                   columnsToShowHandler={columnsToShowHandler}
// // //                 /> */}
// // //                 {/* {FilterOptionList && (
// // //                   <FilterInput optionList={FilterOptionList} />
// // //                 )} */}
// // //               </div>
// // //             )}

// // //             <div className="">
// // //               {total >= 1 && (
// // //                 <Pagination
// // //                   total={total}
// // //                   showTotal={(total, range) =>
// // //                     `${range[0]}-${range[1]} of ${total} items`
// // //                   }
// // //                   onChange={fetchData}
// // //                   defaultPageSize={1000}
// // //                   defaultCurrent={1}
// // //                   showSizeChanger={total > 1000}
// // //                 />
// // //               )}
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <Table
// // //           loading={loading}
// // //           // rowSelection={rowSelection}
// // //           columns={columnsToShow}
// // //           dataSource={
// // //             !!list?.length && list.map((item) => ({ ...item, key: item?.id }))
// // //           }
// // //           pagination={false}
// // //           scroll={{ x: scrollX || 1000, y: window.innerHeight - 319 }}
// // //           onRow={(record) => {
// // //             return {
// // //               onClick: () => handleEdit(record),
// // //             };
// // //           }}
// // //           expandedRowRender={
// // //             expandedRow
// // //               ? (record) =>
// // //                   expandedRow === record.ID && (
// // //                     <div className="expanded-content">
// // //                       {console.log("record in tbl", record)}
// // //                       <p>Additional content for {record.BookingNo}</p>
// // //                     </div>
// // //                   )
// // //               : undefined
// // //           }
// // //         />
// // //       </div>
// // //       {children && children}
// // //     </>
// // //   );
// // // };
// // // export default TableComponent;

// // import { Pagination, Table } from "antd";
// // import { useEffect, useState } from "react";
// // import { useDispatch } from "react-redux";
// // import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown"; // Assuming this is a custom component
// // import FilterInput from "./FilterInput"; // Assuming this is a custom component
// // import { CSVLink } from "react-csv"; // Assuming this is used to export data
// // import DetailBookingEntry from "../entry/bookingEntry/detailBookingEntry"; // Assuming this is another component used for viewing details

// // const TableComponent = ({
// //   columns,
// //   list,
// //   total,
// //   loading,
// //   csvFileName,
// //   paginatedThunk,
// //   paginationStatus,
// //   deleteManyThunk,
// //   children,
// //   query,
// //   onEdit,
// //   scrollX,
// //   FilterOptionList,
// //   expandedRow,
// // }) => {
// //   const dispatch = useDispatch();

// //   // State to store the columns shown
// //   const [columnsToShow, setColumnsToShow] = useState([]);

// //   useEffect(() => {
// //     setColumnsToShow(columns); // Initialize columns state
// //   }, [columns]);

// //   // Function to handle pagination fetch
// //   const fetchData = (page, count) => {
// //     dispatch(
// //       paginatedThunk({
// //         ...query,
// //         status: paginationStatus ? paginationStatus : true,
// //         page,
// //         count,
// //       })
// //     );
// //   };

// //   // Function to handle column visibility change
// //   const columnsToShowHandler = (val) => {
// //     setColumnsToShow(val); // Set the columns based on user preferences
// //   };

// //   // Function to handle record edit
// //   const handleEdit = (record) => {
// //     if (onEdit) {
// //       onEdit(record); // Trigger the edit callback function
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="mt-2">
// //         <div className="pb-3">
// //           <div className="flex flex-col items-center justify-between w-full gap-2 dark:text-yellow-50 md:flex-row">
// //             {csvFileName && (
// //               <div className="flex gap-2">
// //                 {/* CSV Export Button */}
// //                 <CSVLink
// //                   data={list || []}
// //                   className="px-0 py-1 mr-2 text-xs text-white rounded md:text-base"
// //                   filename={csvFileName}
// //                 >
// //                   Download CSV
// //                 </CSVLink>

// //                 {/* Column Visibility Dropdown */}
// //                 <ColVisibilityDropdown
// //                   options={columns}
// //                   columns={columns}
// //                   columnsToShowHandler={columnsToShowHandler}
// //                 />

// //                 {/* Filter Input (optional) */}
// //                 {FilterOptionList && <FilterInput optionList={FilterOptionList} />}
// //               </div>
// //             )}

// //             <div className="">
// //               {total >= 1 && (
// //                 <Pagination
// //                   total={total}
// //                   showTotal={(total, range) =>
// //                     `${range[0]}-${range[1]} of ${total} items`
// //                   }
// //                   onChange={fetchData}
// //                   defaultPageSize={1000}
// //                   defaultCurrent={1}
// //                   showSizeChanger={total > 1000}
// //                 />
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Table displaying data */}
// //         <Table
// //           loading={loading}
// //           columns={columnsToShow}
// //           dataSource={
// //             !!list?.length ? list.map((item) => ({ ...item, key: item?.id })) : []
// //           }
// //           pagination={false} // Disable default pagination, handled separately
// //           scroll={{ x: scrollX || 1000, y: window.innerHeight - 319 }}
// //           onRow={(record) => {
// //             return {
// //               onClick: () => handleEdit(record), // Handle row click for edit
// //             };
// //           }}
// //           expandedRowRender={
// //             expandedRow
// //               ? (record) =>
// //                   expandedRow === record.ID && (
// //                     <div className="expanded-content">
// //                       <p>Additional content for {record.BookingNo}</p>
// //                     </div>
// //                   )
// //               : undefined
// //           }
// //         />
// //       </div>

// //       {/* Render any additional children passed to the component */}
// //       {children && children}
// //     </>
// //   );
// // };

// // export default TableComponent;

// import { Pagination, Table } from "antd";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown"; // Assuming this is a custom component
// import FilterInput from "./FilterInput"; // Assuming this is a custom component
// import { CSVLink } from "react-csv"; // Assuming this is used to export data
// import DetailBookingEntry from "../entry/bookingEntry/detailBookingEntry"; // Assuming this is another component used for viewing details

// const TableComponent = ({
//   columns,
//   list,
//   total,
//   loading,
//   csvFileName,
//   paginatedThunk,
//   paginationStatus,
//   deleteManyThunk,
//   children,
//   query,
//   onEdit,
//   scrollX,
//   FilterOptionList,
//   expandedRow,
// }) => {
//   const dispatch = useDispatch();

//   // State to store the columns shown
//   const [columnsToShow, setColumnsToShow] = useState([]);

//   // Initialize columns state
//   useEffect(() => {
//     setColumnsToShow(columns);
//   }, [columns]);

//   // Fetch data on pagination change
//   const fetchData = (page, count) => {
//     dispatch(
//       paginatedThunk({
//         ...query,
//         status: paginationStatus ? paginationStatus : true,
//         page,
//         count,
//       })
//     );
//   };

//   // Handle column visibility change (called from the ColVisibilityDropdown)
//   const columnsToShowHandler = (val) => {
//     setColumnsToShow(val);
//   };

//   // Handle record edit
//   const handleEdit = (record) => {
//     if (onEdit) {
//       onEdit(record); // Trigger the edit callback function passed as a prop
//     }
//   };

//   return (
//     <>
//       <div className="mt-2">
//         <div className="pb-3">
//           <div className="flex flex-col items-center justify-between w-full gap-2 dark:text-yellow-50 md:flex-row">
//             {csvFileName && (
//               <div className="flex gap-2">
//                 {/* CSV Export Button */}
//                 <CSVLink
//                   data={list || []}
//                   className="px-0 py-1 mr-2 text-xs text-white rounded md:text-base"
//                   filename={csvFileName}
//                 >
//                   Download CSV
//                 </CSVLink>

//                 {/* Column Visibility Dropdown */}
//                 <ColVisibilityDropdown
//                   options={columns}
//                   columns={columns}
//                   columnsToShowHandler={columnsToShowHandler}
//                 />

//                 {/* Filter Input (optional) */}
//                 {FilterOptionList && <FilterInput optionList={FilterOptionList} />}
//               </div>
//             )}

//             {/* Pagination */}
//             <div className="">
//               {total >= 1 && (
//                 <Pagination
//                   total={total}
//                   showTotal={(total, range) =>
//                     `${range[0]}-${range[1]} of ${total} items`
//                   }
//                   onChange={fetchData}
//                   defaultPageSize={1000}
//                   defaultCurrent={1}
//                   showSizeChanger={total > 1000}
//                 />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Table displaying data */}
//         <Table
//           loading={loading}
//           columns={columnsToShow}
//           dataSource={
//             !!list?.length ? list.map((item) => ({ ...item, key: item?.id })) : []
//           }
//           pagination={false} // Disable default pagination, handled separately
//           scroll={{ x: scrollX || 1000, y: window.innerHeight - 319 }}
//           onRow={(record) => {
//             return {
//               onClick: () => handleEdit(record), // Handle row click for edit
//             };
//           }}
//           expandedRowRender={
//             expandedRow
//               ? (record) =>
//                   expandedRow === record.ID && (
//                     <div className="expanded-content">
//                       <p>Additional content for {record.BookingNo}</p>
//                     </div>
//                   )
//               : undefined
//           }
//         />
//       </div>

//       {/* Render any additional children passed to the component */}
//       {children && children}
//     </>
//   );
// };

// export default TableComponent;

import { Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ColVisibilityDropdown from "../Shared/ColVisibilityDropdown"; // Assuming this is a custom component
import FilterInput from "./FilterInput"; // Assuming this is a custom component
import { CSVLink } from "react-csv"; // Assuming this is used to export data
import DetailBookingEntry from "../entry/bookingEntry/detailBookingEntry"; // Assuming this is another component used for viewing details

const TableComponent = ({
  columns,
  list,
  total,
  loading,
  csvFileName,
  paginatedThunk,
  paginationStatus,
  deleteManyThunk,
  children,
  query,
  onEdit,
  scrollX,
  FilterOptionList,
  expandedRow,
}) => {
  const dispatch = useDispatch();

  // State to store the columns shown
  const [columnsToShow, setColumnsToShow] = useState([]);

  useEffect(() => {
    // Prepend "Sl No" column
    const slNoColumn = {
      title: "Sl No",
      dataIndex: "slno",
      key: "slno",
      width: 80,
      render: (_, __, index) => index + 1,
    };

    const updatedColumns = [
      slNoColumn,
      ...columns.map((col) => ({
        ...col,
        ellipsis: true,
      })),
    ];

    setColumnsToShow(updatedColumns);
  }, [columns]);

  // Function to handle pagination fetch
  const fetchData = (page, count) => {
    dispatch(
      paginatedThunk({
        ...query,
        status: paginationStatus ? paginationStatus : true,
        page,
        count,
      })
    );
  };

  // Function to handle column visibility change
  const columnsToShowHandler = (val) => {
    setColumnsToShow(val); // Set the columns based on user preferences
  };

  // Function to handle record edit
  const handleEdit = (record) => {
    if (onEdit) {
      onEdit(record); // Trigger the edit callback function
    }
  };

  return (
    <>
      <div className="mt-2">
        <div className="pb-3">
          <div className="flex flex-col items-center justify-between w-full gap-2 dark:text-yellow-50 md:flex-row">
            {csvFileName && (
              <div className="flex gap-2">
                {/* CSV Export Button */}
                <CSVLink
                  data={list || []}
                  className="px-0 py-1 mr-2 text-xs text-white rounded md:text-base"
                  filename={csvFileName}
                >
                  Download CSV
                </CSVLink>

                {/* Column Visibility Dropdown */}
                <ColVisibilityDropdown
                  options={columns}
                  columns={columns}
                  columnsToShowHandler={columnsToShowHandler}
                />

                {/* Filter Input (optional) */}
                {FilterOptionList && (
                  <FilterInput optionList={FilterOptionList} />
                )}
              </div>
            )}

            <div className="">
              {total >= 1 && (
                <Pagination
                  total={total}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                  onChange={fetchData}
                  defaultPageSize={1000}
                  defaultCurrent={1}
                  showSizeChanger={total > 1000}
                />
              )}
            </div>
          </div>
        </div>

        {/* Table displaying data */}
        <Table
          loading={loading}
          columns={columnsToShow}
          dataSource={
            !!list?.length
              ? list.map((item) => ({ ...item, key: item?.id }))
              : []
          }
          pagination={false} // Disable default pagination, handled separately
          scroll={{ x: scrollX || 1000, y: window.innerHeight - 319 }}
          onRow={(record) => {
            return {
              onClick: () => handleEdit(record), // Handle row click for edit
            };
          }}
          expandedRowRender={
            expandedRow
              ? (record) =>
                  expandedRow === record.ID && (
                    <div className="expanded-content">
                      <p>Additional content for {record.BookingNo}</p>
                    </div>
                  )
              : undefined
          }
        />
      </div>

      {/* Render any additional children passed to the component */}
      {children && children}
    </>
  );
};

export default TableComponent;
