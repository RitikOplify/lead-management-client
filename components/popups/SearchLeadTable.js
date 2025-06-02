import Link from "next/link";
import React, { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import ViewProduct from "./ViewProduct";

function SearchLeadTable({ onClose, leads }) {
  return (
    <>
      <div
        className=" absolute top-[10%] z-50 flex items-center justify-center bg-black/40 w-full left-0 h-[90%] bottom-0"
        onClick={onClose}
      >
        <div
          className="bg-white md:rounded-xl shadow-xl w-full max-w-5xl p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
          >
            <IoClose size={24} />
          </button>
          <h6 className=" py-2.5 font-bold">Search Data</h6>
          <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
            <div className="overflow-x-auto custom-scroller">
              {leads?.length > 0 ? (
                <table className=" w-full whitespace-nowrap divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Enq number",
                        "Action",
                        "Enq Person",
                        "Sales Person",
                        "Dealer",
                        "Contact",
                        "Email",
                        "Company",
                        "Status",
                        "Source",
                        "City",
                        "Date Created",
                        "Last Update",
                        "Products",
                      ].map((head) => (
                        <th
                          key={head}
                          className="p-4 text-left text-sm font-semibold text-gray-600"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leads.map((lead, index) => {
                      const nextDate = new Date(lead.nextFollowUpDate);
                      const now = new Date();
                      const timeDiff = nextDate - now;

                      let rowClass = "";
                      if (lead.nextFollowUpDate) {
                        if (nextDate < now) rowClass = "bg-red-300 text-white";
                        else if (timeDiff <= 86400000) rowClass = "bg-red-100";
                      }

                      return (
                        <tr key={index}>
                          <td className="p-4 text-sm">{lead.enqNo || "NA"}</td>
                          <td className="p-4 flex items-center space-x-4">
                            <FaEdit
                              size={20}
                              className="cursor-pointer"
                              onClick={() => followUpClick(lead.id)}
                            />
                            <Link href={`/lead/${lead.id}`}>
                              <FaEye size={20} />
                            </Link>
                          </td>
                          <td className="p-4 text-sm">{lead.enquiryPerson}</td>
                          <td className="p-4 text-sm flex items-center gap-2">
                            {lead.executiveId ? lead.executive?.username : "NA"}
                          </td>
                          <td className="p-4 text-sm">
                            {lead.dealerId ? lead.dealer?.name : "NA"}
                          </td>
                          <td className="p-4 text-sm">
                            {lead.customer?.contact}
                          </td>
                          <td className="p-4 text-sm">
                            {lead.customer?.email}
                          </td>
                          <td className="p-4 text-sm">
                            {lead.customer?.customerName}
                          </td>
                          <td className="p-4 text-sm">{lead.status}</td>
                          <td className="p-4 text-sm">{lead.source}</td>
                          <td className="p-4 text-sm">{lead.customer?.city}</td>
                          <td className="p-4 text-sm">
                            {new Date(lead.createdAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td className="p-4 text-sm">
                            {new Date(lead.updatedAt).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td className="p-4 text-sm underline cursor-pointer space-x-2">
                            {lead.products?.length > 0 &&
                              lead.products.map((product, idx) => (
                                <span key={idx}>{product.name || "NA"}</span>
                              ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>No data available</p>
                </div>
              )}
            </div>
            {/* <div>
            <div className=" flex justify-end">
              <div className=" p-5">
                <button className=" cursor-pointer" onClick={handlePrevPage}>
                  Previos
                </button>
                <span className="mx-2">
                  Page {page} of {totalLeads}
                </span>
                <button className=" cursor-pointer" onClick={handleNextPage}>
                  Next
                </button>
              </div>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchLeadTable;
