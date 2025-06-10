"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

const Page = () => {
  const { visits } = useSelector((state) => state.leads);

  return (
    <div className="overflow-y-auto rounded-xl max-w-7xl mx-auto bg-white shadow-sm">
      <h1 className="text-3xl px-4 py-4 font-semibold text-gray-900">Visits</h1>
      {visits.length > 0 ? (
        <div className="overflow-x-auto shadow-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold tracking-wide">
              <tr>
                <th className="p-4 text-left">Contact Person</th>
                <th className="p-4 text-left">Customer Name</th>
                <th className="p-4 text-left">Sales Person</th>
                <th className="p-4 text-left">Purpose</th>
                <th className="p-4 text-left">Visit Date</th>
                <th className="p-4 text-left">Lead</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 text-sm divide-y divide-gray-100">
              {visits.map((visit) => (
                <tr
                  key={visit.id}
                  className="transition-colors duration-200 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">{visit?.contactPersonName}</td>
                  <td className="p-4">{visit?.customer?.customerName}</td>
                  <td className="p-4">{visit?.executive?.username}</td>
                  <td className="p-4">{visit.purpose}</td>
                  <td className="p-4">
                    {new Date(visit.visitDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="p-4">
                    {visit.leadId ? (
                      <Link
                        href={`/lead/${visit.leadId}`}
                        className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      >
                        View Lead
                      </Link>
                    ) : (
                      <Link
                        href={`/new-lead?visitId=${visit.id}`}
                        className="inline-block bg-green-600 text-white text-xs font-semibold px-4 py-1 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      >
                        Add Lead
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-3 text-center text-gray-500 shadow">No visits found.</p>
      )}
    </div>
  );
};

export default Page;
