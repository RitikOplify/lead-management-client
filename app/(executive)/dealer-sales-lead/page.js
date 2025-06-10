"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaBars, FaEdit, FaEye } from "react-icons/fa";
import { MdOutlineAccessAlarm } from "react-icons/md";
import CreateFollowUp from "@/components/popups/createFollowUp";
import { useDispatch, useSelector } from "react-redux";
import { asyncAddDealerLeads } from "@/store/actions/leads";
import { FiInbox } from "react-icons/fi"; // import icon at top
const Page = () => {
  const [open, setOpen] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const { dealerLead } = useSelector((state) => state.leads);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncAddDealerLeads());
  }, [dispatch]);

  const followUpClick = (id) => {
    setLeadId(id);
    if (id) setOpen(true);
  };

  const viewClick = (lead) => {
    console.log("View lead", lead);
  };

  const getRowClass = (lead) => {
    if (lead.status?.toLowerCase() === "closed") return "";

    const now = new Date();
    const followUpDate = lead.nextFollowUpDate
      ? new Date(lead.nextFollowUpDate)
      : null;

    if (!followUpDate) return "";

    const timeDiff = followUpDate - now;

    if (followUpDate < now) return "bg-red-200 text-red-900 font-medium";
    if (timeDiff <= 24 * 60 * 60 * 1000)
      return "bg-yellow-100 text-yellow-900 font-medium";

    return "";
  };

  return (
    <div className="p-6 w-full space-y-6 overflow-y-auto">
      {open && <CreateFollowUp onClose={() => setOpen(false)} id={leadId} />}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto custom-scroller">
          {dealerLead.length > 0 ? (
            <table className="min-w-[1136px] w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Dealer Name",
                    "Enq No",
                    "Enquiry Person",
                    "Contact",
                    "Email",
                    "Company",
                    "City",
                    "Source",
                    "Status",
                    "Date Created",
                    "Last Update",
                    "Products",
                    "Action",
                  ].map((head, idx) => (
                    <th
                      key={idx}
                      className="p-4 text-left text-sm font-semibold text-gray-600"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dealerLead.map((lead, index) => (
                  <tr key={index} className={getRowClass(lead)}>
                    <td className="p-4 text-sm">
                      {lead.dealerId ? lead.dealer?.name : "NA"}
                    </td>
                    <td className="p-4 text-sm">{lead.enqNo || "NA"}</td>
                    <td className="p-4 text-sm">{lead.enquiryPerson}</td>
                    <td className="p-4 text-sm">{lead.customer?.contact}</td>
                    <td className="p-4 text-sm">{lead.customer?.email}</td>
                    <td className="p-4 text-sm">
                      {lead.customer?.customerName}
                    </td>
                    <td className="p-4 text-sm">{lead.city}</td>
                    <td className="p-4 text-sm">{lead.source || "NA"}</td>
                    <td className="p-4 text-sm">{lead.status}</td>
                    <td className="p-4 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(lead.updatedAt).toLocaleDateString("en-GB")}
                    </td>
                    <td
                      className="p-4 text-sm underline text-blue-600 cursor-pointer"
                      onClick={() => viewClick(lead)}
                    >
                      View
                    </td>
                    <td className="p-4 flex items-center space-x-4">
                      <FaEdit
                        size={18}
                        className="text-gray-700"
                        onClick={() => followUpClick(lead.id)}
                      />
                      <Link href={`/lead/${lead.id}`}>
                        <FaEye size={18} className="text-blue-700" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-3">
              <FiInbox size={48} />
              <p className="text-lg font-medium">No data available</p>
              <p className="text-sm text-gray-500 max-w-xs text-center">
                There are currently no dealer leads to display. Please check
                back later or try refreshing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
