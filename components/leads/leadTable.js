"use client";
import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaEye,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { AiOutlineFileExcel } from "react-icons/ai";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import CreateFollowUp from "../popups/createFollowUp";
import ViewProduct from "../popups/ViewProduct";
import ReassignExecutive from "../popups/ReassignExecutive";
import EditLead from "../popups/EditLeadPopUp";
import { asyncGetAllLeads } from "@/store/actions/leads";
import DownloadLeadsModal from "../popups/DownloadLeadsModal";

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
  const [modelOpen, setModalOpen] = useState(false);

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

  const handlePrevPage = () => page > 1 && setPage(page - 1);
  const handleNextPage = () => page < totalLeads && setPage(page + 1);

  return (
    <>
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
      {modelOpen && <DownloadLeadsModal onClose={() => setModalOpen(false)} />}

      <div className="bg-white shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 p-4 bg-gray-50 rounded-t-xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
            Lead Overview
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 transition-transform hover:scale-105"
            >
              <AiOutlineFileExcel size={22} />
              Export
            </button>
            <Link
              href="/new-lead"
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition"
            >
              <FaPlus size={14} />
              New Lead
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto custom-scroller">
          {leads?.length > 0 ? (
            <table className="min-w-[1200px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  {[
                    "Enq No",
                    "Action",
                    "Enquiry Person",
                    "Sales Person",
                    "Dealer",
                    "Contact",
                    "Email",
                    "Company",
                    "Status",
                    "Source",
                    "City",
                    "Created",
                    "Updated",
                    "Products",
                  ].map((head) => (
                    <th
                      key={head}
                      className="p-4 text-left text-sm whitespace-nowrap font-semibold"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leads.map((lead, index) => {
                  if (lead.status?.toLowerCase() === "closed") return null;

                  const nextDate = new Date(lead.nextFollowUpDate);
                  const now = new Date();
                  const timeDiff = nextDate - now;
                  let rowClass = "bg-white";

                  if (lead.nextFollowUpDate) {
                    if (nextDate < now) rowClass = "bg-red-50 text-red-700";
                    else if (timeDiff <= 86400000)
                      rowClass = "bg-yellow-50 text-yellow-800";
                    else rowClass = "bg-blue-50 text-blue-800";
                  }

                  return (
                    <tr key={index} className={`${rowClass} transition-all`}>
                      <td className="p-4 whitespace-nowrap">
                        {lead.enqNo || "NA"}
                      </td>
                      <td className="p-4 whitespace-nowrap flex items-center gap-3">
                        <FaEdit
                          className="cursor-pointer hover:text-blue-600"
                          onClick={() => followUpClick(lead.id)}
                        />
                        <Link href={`/lead/${lead.id}`}>
                          <FaEye className="cursor-pointer hover:text-gray-600" />
                        </Link>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {lead.enquiryPerson}
                      </td>
                      <td className="p-4 whitespace-nowrap flex items-center gap-2">
                        {lead.executiveId ? lead.executive?.username : "NA"}
                        {user.role === "admin" && (
                          <HiOutlineSwitchVertical
                            className="cursor-pointer hover:text-purple-600"
                            onClick={() => handleReassignExecutive(lead.id)}
                          />
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {lead.dealerId ? lead.dealer?.name : "NA"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {lead.contact || lead.customer?.contact}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {lead.email || lead.customer?.email}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {lead.customer?.customerName}
                      </td>
                      <td className="p-4 whitespace-nowrap">{lead.status}</td>
                      <td className="p-4 whitespace-nowrap">{lead.source}</td>
                      <td className="p-4 whitespace-nowrap">{lead.city}</td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {new Date(lead.updatedAt).toLocaleDateString("en-GB")}
                      </td>
                      <td
                        className="p-4 whitespace-nowrap text-blue-600 underline cursor-pointer"
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
            <div className="flex justify-center items-center h-64 text-gray-400">
              No data available
            </div>
          )}
        </div>

        {leads?.length > 0 && (
          <div className="flex justify-end items-center gap-4 p-4">
            <button
              onClick={handlePrevPage}
              className="flex items-center cursor-pointer"
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalLeads}
            </span>
            <button
              onClick={handleNextPage}
              className="flex items-center cursor-pointer"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LeadDataTable;
