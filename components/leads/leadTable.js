// "use client";
// import React, { useState } from "react";
// import { FaEdit, FaEye, FaPlus } from "react-icons/fa";
// import { MdOutlineAccessAlarm } from "react-icons/md";
// import Nav from "../Nav";
// import { useSelector } from "react-redux";
// import { HiOutlineSwitchVertical } from "react-icons/hi";

// import CreateFollowUp from "../popups/createFollowUp";
// import Link from "next/link";
// import ViewProduct from "../popups/ViewProduct";
// import ReassignExecutive from "../popups/ReassignExecutive";
// import EditLead from "../popups/EditLeadPopUp";
// const LeadDataTable = () => {
//   const [open, setOpen] = useState(false);
//   const [productOpen, setProductOpen] = useState(false);
//   const [leadData, setLeadData] = useState();
//   const [leadId, setLeadId] = useState(null);
//   const { user } = useSelector((state) => state.auth);
//   const [assignOpen, setAssignOpen] = useState(false);
//   const [editLead, setEditLead] = useState(false);
//   const [editLeadId, setEditLeadId] = useState(false);

//   const { company, leads } = useSelector((state) => state.leads);
//   const followUpClick = (leadId) => {
//     setLeadId(leadId);
//     if (!leadId) return;
//     setOpen(true);
//   };

//   const viewClick = (lead) => {
//     setLeadData(lead);
//     if (!lead) return;
//     setProductOpen(true);
//   };

//   const handleReassignExecutive = async (leadId) => {
//     if (!leadId) return;
//     setLeadId(leadId);
//     setAssignOpen(true);
//   };

//   return (
//     <div className="flex h-screen mx-auto">
//       <Nav />
//       {open && <CreateFollowUp onClose={() => setOpen(false)} id={leadId} />}
//       {productOpen && (
//         <ViewProduct onClose={() => setProductOpen(false)} lead={leadData} />
//       )}
//       {assignOpen && (
//         <ReassignExecutive
//           onClose={() => setAssignOpen(false)}
//           leadId={leadId}
//         />
//       )}

//       {editLead && (
//         <EditLead
//           onClose={() => {
//             setEditLead(false);
//             setEditLeadId("");
//           }}
//           leadId={editLeadId}
//         />
//       )}

//       <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h2 className="text-xl font-semibold">Lead Data</h2>
//           </div>
//           <Link
//             href={"/new-lead"}
//             className="bg-[#092C1C] text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2"
//           >
//             <FaPlus /> Add Lead Entry
//           </Link>
//         </div>
//         <div className="bg-white shadow-md rounded-lg overflow-hidden">
//           <div className="overflow-x-auto custom-scroller">
//             {leads?.length > 0 ? (
//               <table className="min-w-[1136px] w-full whitespace-nowrap divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Enq number
//                     </th>

//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Enq Person
//                     </th>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Sales Person
//                     </th>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Dealer
//                     </th>

//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Contact
//                     </th>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Email
//                     </th>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Company
//                     </th>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Status
//                     </th>

//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Source
//                     </th>

//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       City
//                     </th>

//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Date Created
//                     </th>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Last Update
//                     </th>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Products
//                     </th>
//                     <th className="p-4 text-left text-sm font-semibold text-gray-600">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {leads?.map((lead, index) => (
//                     <tr
//                       key={index}
//                       className={` ${
//                         editLeadId === lead.id && "bg-green-200!"
//                       } ${
//                         lead.nextFollowUpDate
//                           ? (() => {
//                               const nextDate = new Date(lead.nextFollowUpDate);
//                               const now = new Date();
//                               const diff = nextDate - now;
//                               if (nextDate < now)
//                                 return "bg-red-300 text-white";
//                               if (diff <= 24 * 60 * 60 * 1000)
//                                 return "bg-red-100";
//                               return "";
//                             })()
//                           : ""
//                       }`}
//                     >
//                       <td className="p-4 text-sm">{lead.enqNo || "NA"}</td>

//                       <td className="p-4 text-sm">{lead.enquiryPerson}</td>
//                       <td className="p-4 text-sm flex items-center gap-2">
//                         {lead.executiveId ? lead.executive?.username : "NA"}
//                         {user.role === "admin" && (
//                           <HiOutlineSwitchVertical
//                             className="cursor-pointer"
//                             onClick={() => handleReassignExecutive(lead.id)}
//                           />
//                         )}
//                       </td>
//                       <td className="p-4 text-sm">
//                         {lead.dealerId ? lead.dealer?.name : "NA"}
//                       </td>
//                       <td className="p-4 text-sm">{lead.customer?.contact}</td>
//                       <td className="p-4 text-sm">{lead.customer?.email}</td>
//                       <td className="p-4 text-sm">
//                         {lead.customer?.customerName}
//                       </td>
//                       <td className="p-4 text-sm">{lead.status}</td>
//                       <td className="p-4 text-sm">{lead.source}</td>
//                       <td className="p-4 text-sm">{lead.customer?.city}</td>

//                       <td className="p-4 text-sm">
//                         {new Date(lead.createdAt).toLocaleDateString("en-GB")}
//                       </td>
//                       <td className="p-4 text-sm">
//                         {new Date(lead.updatedAt).toLocaleDateString("en-GB")}
//                       </td>
//                       <td
//                         className="p-4 text-sm underline cursor-pointer"
//                         onClick={() => {
//                           viewClick(lead);
//                         }}
//                       >
//                         View
//                       </td>

//                       <td className="p-4 flex items-center space-x-4">
//                         <div
//                           className="cursor-pointer"
//                           onClick={() => {
//                             setEditLead(true);
//                             setEditLeadId(lead.id);
//                           }}
//                         >
//                           <FaEdit size={20} />
//                         </div>
//                         <Link href={`/lead/${lead.id}`}>
//                           <FaEye size={20} />
//                         </Link>

//                         <MdOutlineAccessAlarm
//                           className="cursor-pointer"
//                           size={20}
//                           onClick={() => {
//                             followUpClick(lead.id);
//                           }}
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="flex items-center justify-center h-64 text-gray-500">
//                 <p>No data available</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadDataTable;

"use client";
import React, { useEffect, useState } from "react";
import { FaBars, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { MdOutlineAccessAlarm } from "react-icons/md";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import Nav from "../Nav";
import CreateFollowUp from "../popups/createFollowUp";
import ViewProduct from "../popups/ViewProduct";
import ReassignExecutive from "../popups/ReassignExecutive";
import EditLead from "../popups/EditLeadPopUp";
import { asyncGetAllLeads } from "@/store/actions/leads";

const LeadDataTable = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { leads, totalLeads } = useSelector((state) => state.leads);

  const [page, setPage] = useState(1);
  const leadsPerPage = 10;

  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [editLead, setEditLead] = useState(false);

  const [leadData, setLeadData] = useState();
  const [leadId, setLeadId] = useState(null);
  const [editLeadId, setEditLeadId] = useState(null);

  useEffect(() => {
    dispatch(asyncGetAllLeads(page, leadsPerPage));
  }, [dispatch, page]);

  const followUpClick = (leadId) => {
    if (!leadId) return;
    setLeadId(leadId);
    setOpen(true);
  };

  const viewClick = (lead) => {
    if (!lead) return;
    setLeadData(lead);
    setProductOpen(true);
  };

  const handleReassignExecutive = (leadId) => {
    if (!leadId) return;
    setLeadId(leadId);
    setAssignOpen(true);
  };

  const handlePrevPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page >= totalLeads) return;
    setPage(page + 1);
  };

  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen mx-auto">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      {open && <CreateFollowUp onClose={() => setOpen(false)} id={leadId} />}
      {productOpen && (
        <ViewProduct onClose={() => setProductOpen(false)} lead={leadData} />
      )}
      {assignOpen && (
        <ReassignExecutive
          onClose={() => setAssignOpen(false)}
          leadId={leadId}
        />
      )}
      {editLead && (
        <EditLead
          onClose={() => {
            setEditLead(false);
            setEditLeadId(null);
          }}
          leadId={editLeadId}
        />
      )}

      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Lead Data</h2>
          <Link
            href={"/new-lead"}
            className="bg-[#092C1C] text-white px-3 py-2 rounded cursor-pointer flex items-center gap-2"
          >
            <FaPlus /> Add Lead Entry
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto custom-scroller">
            {leads?.length > 0 ? (
              <table className="min-w-[1136px] w-full whitespace-nowrap divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Enq number",
                      "Action",
                      "Enq Person",
                      "Sales Person",
                      "Dealer",
                      "Contact",
                      "Email",
                      "Company",
                      "Status",
                      "Source",
                      "City",
                      "Date Created",
                      "Last Update",
                      "Products",
                    ].map((head) => (
                      <th
                        key={head}
                        className="p-4 text-left text-sm font-semibold text-gray-600"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead, index) => {
                    const nextDate = new Date(lead.nextFollowUpDate);
                    const now = new Date();
                    const timeDiff = nextDate - now;

                    let rowClass = "";
                    if (lead.nextFollowUpDate) {
                      if (nextDate < now) rowClass = "bg-red-300 text-white";
                      else if (timeDiff <= 86400000) rowClass = "bg-red-100";
                    }

                    return (
                      <tr
                        key={index}
                        className={`${rowClass} ${
                          editLeadId === lead.id ? "bg-green-200" : ""
                        }`}
                      >
                        <td className="p-4 text-sm">{lead.enqNo || "NA"}</td>
                        <td className="p-4 flex items-center space-x-4">
                          <FaEdit
                            size={20}
                            className="cursor-pointer"
                            onClick={() => followUpClick(lead.id)}
                          />
                          <Link href={`/lead/${lead.id}`}>
                            <FaEye size={20} />
                          </Link>
                        </td>
                        <td className="p-4 text-sm">{lead.enquiryPerson}</td>
                        <td className="p-4 text-sm flex items-center gap-2">
                          {lead.executiveId ? lead.executive?.username : "NA"}
                          {user.role === "admin" && (
                            <HiOutlineSwitchVertical
                              className="cursor-pointer"
                              onClick={() => handleReassignExecutive(lead.id)}
                            />
                          )}
                        </td>
                        <td className="p-4 text-sm">
                          {lead.dealerId ? lead.dealer?.name : "NA"}
                        </td>
                        <td className="p-4 text-sm">
                          {lead.customer?.contact}
                        </td>
                        <td className="p-4 text-sm">{lead.customer?.email}</td>
                        <td className="p-4 text-sm">
                          {lead.customer?.customerName}
                        </td>
                        <td className="p-4 text-sm">{lead.status}</td>
                        <td className="p-4 text-sm">{lead.source}</td>
                        <td className="p-4 text-sm">{lead.customer?.city}</td>
                        <td className="p-4 text-sm">
                          {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                        </td>
                        <td className="p-4 text-sm">
                          {new Date(lead.updatedAt).toLocaleDateString("en-GB")}
                        </td>
                        <td
                          className="p-4 text-sm underline cursor-pointer"
                          onClick={() => viewClick(lead)}
                        >
                          View
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No data available</p>
              </div>
            )}
          </div>
          {leads?.length > 0 && (
            <div>
              <div className=" flex justify-end">
                <div className=" p-5">
                  <button className=" cursor-pointer" onClick={handlePrevPage}>
                    Previous
                  </button>
                  <span className="mx-2">
                    Page {page} of {totalLeads}
                  </span>
                  <button className=" cursor-pointer" onClick={handleNextPage}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDataTable;
