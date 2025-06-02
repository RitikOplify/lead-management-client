"use client";
import React, { useState } from "react";
import Nav from "@/components/Nav";
import Link from "next/link";
import { useSelector } from "react-redux";
import { asyncAddVisits } from "@/store/actions/leads";
import { FaBars } from "react-icons/fa";

const Page = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { visits } = useSelector((state) => state.leads);

  console.log("Visits Data:", visits);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>
        <h1 className="text-xl font-semibold">Vists</h1>
        <div className="overflow-x-auto custom-scroller shadow-md rounded-lg">
          {visits.length > 0 ? (
            <table className="w-full min-w-[1136px] whitespace-nowrap divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Contact Person Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Customer Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Purpose
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Visit Date
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Lead
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td className="p-4 text-sm">{visit?.contactPersonName}</td>
                    <td className="p-4 text-sm">
                      {visit?.customer?.customerName}
                    </td>
                    <td className="p-4 text-sm">{visit.purpose}</td>
                    <td className="p-4 text-sm">
                      {new Date(visit.visitDate).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-4 text-sm">
                      {visit.leadId ? (
                        <Link
                          href={`/lead/${visit.leadId}`}
                          className="text-white bg-blue-500 rounded-md px-3 py-1"
                        >
                          View Lead
                        </Link>
                      ) : (
                        <Link
                          href={`/new-lead?visitId=${visit.id}`}
                          className="text-white bg-[#092C1C] rounded-md px-3 py-1"
                        >
                          Add Lead
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No visits found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
