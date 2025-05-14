"use client";
import React, { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import axios from "@/utils/axios";
import Link from "next/link";
import { FaEdit, FaEye } from "react-icons/fa";
import { MdOutlineAccessAlarm } from "react-icons/md";
import ViewProduct from "@/components/popups/ViewProduct";
import CreateFollowUp from "@/components/popups/createFollowUp";
import { useDispatch, useSelector } from "react-redux";
import { asyncAddMyLeads } from "@/store/actions/leads";

const Page = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [leadData, setLeadData] = useState();
  const dispatch = useDispatch();

  const { myLeads } = useSelector((state) => state.leads);

  useEffect(() => {
    dispatch(asyncAddMyLeads());
  }, []);
  const viewClick = (lead) => {
    setLeadData(lead);
    if (!lead) return;
    setProductOpen(true);
  };
  const [leadId, setLeadId] = useState(null);
  const [open, setOpen] = useState(false);

  const followUpClick = (leadId) => {
    setLeadId(leadId);
    if (!leadId) return;
    setOpen(true);
  };
  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      {productOpen && (
        <ViewProduct onClose={() => setProductOpen(false)} lead={leadData} />
      )}

      {open && <CreateFollowUp onClose={() => setOpen(false)} id={leadId} />}

      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto custom-scroller">
            {myLeads.length > 0 ? (
              <table className="min-w-[1136px] w-full whitespace-nowrap divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Next Task
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Enq number
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Enq Person
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Dealer
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Contact
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Email
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Company
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      City
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Source
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Date Created
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Last Update
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Products
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myLeads.map((lead, index) => (
                    <tr
                      key={index}
                      className={`${
                        lead.nextFollowUpDate
                          ? (() => {
                              const nextDate = new Date(lead.nextFollowUpDate);
                              const now = new Date();
                              const diff = nextDate - now;
                              if (nextDate < now)
                                return "bg-red-300 text-white";
                              if (diff <= 24 * 60 * 60 * 1000)
                                return "bg-red-100";
                              return "";
                            })()
                          : ""
                      }`}
                    >
                      <td className="p-4 text-sm">
                        {lead.nextFollowUpStep || "NA"}
                      </td>
                      <td className="p-4 text-sm">{lead.enqNo || "NA"}</td>

                      <td className="p-4 text-sm">{lead.name}</td>

                      <td className="p-4 text-sm">
                        {lead.dealerId ? lead.dealer?.name : "NA"}
                      </td>
                      <td className="p-4 text-sm">{lead.contact}</td>
                      <td className="p-4 text-sm">{lead.email}</td>
                      <td className="p-4 text-sm">{lead.companyName}</td>
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
                        className="p-4 text-sm underline cursor-pointer"
                        onClick={() => {
                          viewClick(lead);
                        }}
                      >
                        View
                      </td>

                      <td className="p-4 flex items-center space-x-4">
                        <Link href={`/lead/edit/${lead.id}`}>
                          <FaEdit size={20} />
                        </Link>
                        <Link href={`/lead/${lead.id}`}>
                          <FaEye size={20} />
                        </Link>

                        <MdOutlineAccessAlarm
                          className="cursor-pointer"
                          size={20}
                          onClick={() => {
                            followUpClick(lead.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
