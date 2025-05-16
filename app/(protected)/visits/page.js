"use client";
import React, { useState } from "react";
import Nav from "@/components/Nav";
import Link from "next/link";
import { useSelector } from "react-redux";
import { asyncAddVisits } from "@/store/actions/leads";

const Page = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { visits } = useSelector((state) => state.leads);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <h1 className="text-xl font-semibold">Vists</h1>
        <div className="overflow-x-auto custom-scroller shadow-md rounded-lg">
          {visits.length > 0 ? (
            <table className="w-full min-w-[1136px] whitespace-nowrap divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Company Name
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
                    <td className="p-4 text-sm">{visit.companyName}</td>
                    <td className="p-4 text-sm">{visit.customerName}</td>
                    <td className="p-4 text-sm">{visit.purpose}</td>
                    <td className="p-4 text-sm">
                      {new Date(visit.visitDate).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-4 text-sm">
                      {visit.leadId ? (
                        <Link
                          href={`/lead/${visit.leadId}`}
                          className="text-blue-500"
                        >
                          View Lead
                        </Link>
                      ) : (
                        <Link href={`/new-lead?visitId=${visit.id}`} className="text-yellow-500">Add Lead</Link>
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
