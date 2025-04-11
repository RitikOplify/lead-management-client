"use client";
import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { MdOutlineAccessAlarm } from "react-icons/md";

import Nav from "../Nav";
import { useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import CreateFollowUp from "../popups/createFollowUp";
import Link from "next/link";
const LeadDataTable = () => {
  const [open, setOpen] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const { company } = useSelector((state) => state.leads);
  const followUpClick = (leadId) => {
    setLeadId(leadId);
    if (!leadId) return;
    setOpen(true);
  };
  return (
    <div className="flex h-screen max-w-[1440px] mx-auto">
      <Nav />
      {open && <CreateFollowUp onClose={() => setOpen(false)} id={leadId} />}
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Import Data</h2>
            <p className="text-sm text-gray-500">Dashboard &gt; Import Data</p>
          </div>
          <button className="flex items-center bg-green-800 text-white px-4 py-2 rounded">
            <FaPlus className="mr-2" /> Add Import Entry
          </button>
        </div>

        <div className=" flex items-center justify-end mb-4 space-x-4">
          <FaEye className="text-gray-600 hover:text-black cursor-pointer" />
          <FaEdit className="text-blue-600 hover:text-blue-800 cursor-pointer" />
          <FaTrash className="text-red-600 hover:text-red-800 cursor-pointer" />
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <div className="overflow-x-auto custom-scroller">
            {company?.leads?.length > 0 ? (
              <table className="min-w-[1136px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Action
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Contact
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Email
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Stage
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Source
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      Price
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      City
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-600">
                      State
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {company?.leads?.map((lead, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-4 flex items-center space-x-4">
                        <Link href={`/lead/${lead.id}`}>
                          <FaEye size={20} />
                        </Link>

                        <MdOutlineAccessAlarm
                          size={20}
                          onClick={() => {
                            followUpClick(lead.id);
                          }}
                        />
                      </td>
                      <td className="p-4 text-sm text-gray-700">{lead.name}</td>
                      <td className="p-4 text-sm text-gray-700">
                        {lead.contact}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {lead.email}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {lead.status}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {lead.stage}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {lead.source}
                      </td>
                      <td className="p-4 text-sm text-gray-700">
                        {lead.price}
                      </td>
                      <td className="p-4 text-sm text-gray-700">{lead.city}</td>
                      <td className="p-4 text-sm text-gray-700">
                        {lead.state}
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
          <div className="flex items-center justify-between p-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>Items per page:</span>
              <div className=" relative w-12">
                <select className="border rounded appearance-none w-full px-2 py-1">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <IoIosArrowDown size={16} />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span>01</span>
              <span>of</span>
              <span>20</span>
              <button className="px-2">&lt;</button>
              <button className="px-2">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDataTable;
