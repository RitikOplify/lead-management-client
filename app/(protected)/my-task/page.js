"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaEye } from "react-icons/fa";
import { asyncAddMyLeads } from "@/store/actions/leads";
import ViewProduct from "@/components/popups/ViewProduct";
import CreateFollowUp from "@/components/popups/createFollowUp";
import Loader from "@/components/loader";

const MyLeadsPage = () => {
  const dispatch = useDispatch();
  const { myLeads } = useSelector((state) => state.leads);
  const [leadData, setLeadData] = useState(null);
  const [leadId, setLeadId] = useState(null);

  const [productOpen, setProductOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);

  const { currentCompany } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(asyncAddMyLeads(currentCompany, setLoading));
  }, [dispatch]);

  const openProduct = (lead) => {
    setLeadData(lead);
    setProductOpen(true);
  };

  const openFollowUp = (id) => {
    setLeadId(id);
    setFollowUpOpen(true);
  };

  return (
    <>
      {productOpen && (
        <ViewProduct onClose={() => setProductOpen(false)} lead={leadData} />
      )}
      {followUpOpen && (
        <CreateFollowUp onClose={() => setFollowUpOpen(false)} id={leadId} />
      )}

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">My Leads</h2>
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

        {loading ? (
          <div className="h-screen flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="overflow-x-auto custom-scroller">
            {myLeads?.length > 0 ? (
              <table className="min-w-[1200px] w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    {[
                      "Enq No",
                      "Actions",
                      "Next Task",
                      "Enquiry Person",
                      "Dealer",
                      "Contact",
                      "Email",
                      "Company",
                      "City",
                      "Source",
                      "Status",
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

                <tbody className="divide-y divide-gray-100">
                  {myLeads.map((lead) => {
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
                      <tr key={lead.id} className={`${rowClass} transition`}>
                        <td className="p-4 whitespace-nowrap">
                          {lead.enqNo || "NA"}
                        </td>
                        <td className="flex items-center p-4 gap-3">
                          <FaEdit
                            className="cursor-pointer hover:text-blue-600"
                            onClick={() => openFollowUp(lead.id)}
                          />
                          <Link href={`/lead/${lead.id}`}>
                            <FaEye className="cursor-pointer hover:text-gray-600" />
                          </Link>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {lead.nextFollowUpStep || "NA"}
                        </td>

                        <td className="p-4  whitespace-nowrap">
                          {lead.enquiryPerson}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {lead.dealer?.name || "NA"}
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
                        <td className="p-4  whitespace-nowrap">{lead.city}</td>
                        <td className="p-4  whitespace-nowrap">
                          {lead.source || "NA"}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {lead.status?.toLowerCase() === "closed"
                            ? `${lead.status} (${lead.finalStatus})`
                            : lead.status}
                        </td>
                        <td className="p-4  whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                        </td>
                        <td className="p-4">
                          {new Date(lead.updatedAt).toLocaleDateString("en-GB")}
                        </td>
                        <td
                          className="p-4 text-blue-600 underline cursor-pointer"
                          onClick={() => openProduct(lead)}
                        >
                          View
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center items-center mb-5 text-gray-400">
                No leads available.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MyLeadsPage;
