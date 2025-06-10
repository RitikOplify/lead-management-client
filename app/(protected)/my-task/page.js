"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdOutlineAccessAlarm } from "react-icons/md";
import { asyncAddMyLeads } from "@/store/actions/leads";
import ViewProduct from "@/components/popups/ViewProduct";
import CreateFollowUp from "@/components/popups/CreateFollowUp";
import EditLead from "@/components/popups/EditLeadPopUp";

const MyLeadsPage = () => {
  const dispatch = useDispatch();
  const { myLeads } = useSelector((state) => state.leads);
  const [leadData, setLeadData] = useState(null);
  const [leadId, setLeadId] = useState(null);
  const [editLeadId, setEditLeadId] = useState(null);

  const [productOpen, setProductOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const { currentCompany } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(asyncAddMyLeads(currentCompany));
  }, [dispatch]);

  const openProduct = (lead) => {
    setLeadData(lead);
    setProductOpen(true);
  };

  const openFollowUp = (id) => {
    setLeadId(id);
    setFollowUpOpen(true);
  };

  const getRowColor = (lead) => {
    if (!lead?.nextFollowUpDate) return "";
    const nextDate = new Date(lead.nextFollowUpDate);
    const now = new Date();
    const diff = nextDate - now;

    if (nextDate < now) return "bg-red-50 text-red-700";
    if (diff <= 86400000) return "bg-yellow-50 text-yellow-800";
    return "bg-blue-50 text-blue-800";
  };

  return (
    <>
      {productOpen && (
        <ViewProduct onClose={() => setProductOpen(false)} lead={leadData} />
      )}
      {followUpOpen && (
        <CreateFollowUp onClose={() => setFollowUpOpen(false)} id={leadId} />
      )}
      {editLeadOpen && (
        <EditLead
          leadId={editLeadId}
          onClose={() => {
            setEditLeadOpen(false);
            setEditLeadId(null);
          }}
        />
      )}

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">My Leads</h2>
        </div>

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
                {myLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`${getRowColor(lead)} transition`}
                  >
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
                    <td className="p-4  whitespace-nowrap">{lead.status}</td>
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
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-400">
              No leads available.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyLeadsPage;
