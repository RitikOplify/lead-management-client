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
import { asyncGetAllLeads } from "@/store/actions/leads";
import DownloadLeadsModal from "../popups/DownloadLeadsModal";
import Loader from "../loader";

const LeadDataTable = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { leads, totalLeads } = useSelector((state) => state.leads);

  const [page, setPage] = useState(1);
  const leadsPerPage = 10;

  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const [leadData, setLeadData] = useState();
  const [leadId, setLeadId] = useState(null);

  const [modelOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "executive")) {
      dispatch(asyncGetAllLeads(page, leadsPerPage, setLoading));
    }
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
      {modelOpen && <DownloadLeadsModal onClose={() => setModalOpen(false)} />}

      <div className="bg-white shadow-lg rounded-xl">
        {/* Header */}
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

        <div className="flex flex-wrap gap-4 p-4 text-sm border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></span>
            <span>Follow-up overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-yellow-50 border border-yellow-300"></span>
            <span>Follow-up today</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-blue-50 border border-blue-300"></span>
            <span>Upcoming follow-up</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-green-100 border border-green-300"></span>
            <span>Closed (Converted)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-rose-100 border border-rose-300"></span>
            <span>Closed (Lost)</span>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="h-screen flex justify-center items-center">
            <Loader />
          </div>
        ) : (
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
                    let rowClass = "bg-white text-slate-700 hover:bg-gray-50";

                    if (lead.status?.toLowerCase() === "closed") {
                      if (lead.finalStatus?.toLowerCase() === "converted") {
                        rowClass = "bg-green-100 text-green-900";
                      } else if (lead.finalStatus?.toLowerCase() === "lost") {
                        rowClass = "bg-rose-100 text-rose-900";
                      }
                    } else if (lead.nextFollowUpDate) {
                      const nextDate = new Date(lead.nextFollowUpDate);
                      const now = new Date();
                      const timeDiff = nextDate - now;

                      if (nextDate < now) {
                        rowClass = "bg-amber-100 text-amber-900";
                      } else if (timeDiff <= 86400000) {
                        rowClass = "bg-yellow-50 text-yellow-900";
                      } else {
                        rowClass = "bg-blue-50 text-blue-900";
                      }
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
                        <td className="p-4 whitespace-nowrap">
                          {lead.status?.toLowerCase() === "closed"
                            ? `${lead.status} (${lead.finalStatus})`
                            : lead.status}
                        </td>
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
              <p className="mb-5 p-4">No data available</p>
            )}
          </div>
        )}

        {/* Pagination */}
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
