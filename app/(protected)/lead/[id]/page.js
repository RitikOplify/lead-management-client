"use client";
import React, { use, useEffect, useState } from "react";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import Loader from "@/components/loader";
import { useSelector } from "react-redux";
import Link from "next/link";
import CreateFollowUp from "@/components/popups/createFollowUp";

function Page({ params }) {
  const { id } = use(params);
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [leadId, setLeadId] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/lead/${id}`);
        setLead(data.lead);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error?.response?.data?.message || "Failed to fetch lead");
      }
    };
    fetchLeadDetails();
  }, [id]);

  const followUpClick = (leadId) => {
    setLeadId(leadId);
    if (!leadId) return;
    setOpen(true);
  };

  return (
    <div className="p-4 w-full overflow-y-auto custom-scroller2">
      {open && <CreateFollowUp onClose={() => setOpen(false)} id={leadId} />}

      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : lead ? (
        <div className="bg-white rounded-lg shadow-lg w-full p-6 mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-slate-900">
              Lead Details
            </h2>
            <div className="flex gap-4">
              <Link
                href={`/new-visit?leadId=${lead.id}`}
                className="bg-blue-700 hover:bg-blue-800 transition-colors duration-300 text-white px-4 py-2 rounded-lg font-medium shadow-md flex items-center"
              >
                Add Visit
              </Link>
              <button
                onClick={() => followUpClick(lead.id)}
                className="bg-blue-700 hover:bg-blue-800 transition-colors duration-300 text-white px-4 py-2 rounded-lg font-medium shadow-md flex items-center"
              >
                Add Followup
              </button>
            </div>
          </div>

          {/* Lead Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700">
            {[
              { label: "Name", value: lead.customer?.customerName || "NA" },
              { label: "Email", value: lead.customer?.email || "NA" },
              { label: "Contact", value: lead.customer?.contact || "NA" },
              { label: "City", value: lead.city || "NA" },
              { label: "State", value: lead.state || "NA" },
              { label: "Status", value: lead.status || "NA" },
              { label: "Final Status", value: lead.finalStatus || "NA" },
              { label: "Source", value: lead.source || "NA" },
              {
                label: "Price",
                value: lead.price ? `${lead.price.toLocaleString()} ₹` : "NA",
              },
              { label: "Comments", value: lead.comments || "NA" },
            ].map(({ label, value }) => (
              <p
                key={label}
                className="bg-slate-100 p-4 rounded-lg shadow-inner"
              >
                <span className="font-semibold text-slate-900">{label}:</span>{" "}
                {value}
              </p>
            ))}
          </div>

          {/* Product Info */}
          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4 text-slate-900 border-b border-slate-300 pb-2">
              Product Info
            </h3>
            {lead.products?.length ? (
              lead.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-100 p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <p className="text-slate-800 font-medium">{product.name}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No products available</p>
            )}
          </section>

          {/* Categories */}
          {lead.categories?.length > 0 && (
            <section className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-slate-900 border-b border-slate-300 pb-2">
                Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {lead.categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-slate-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <p className="text-slate-800 font-medium">{cat.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Visits Info */}
          {lead.visits?.length > 0 && (
            <section className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-slate-900 border-b border-slate-300 pb-2">
                Visits Info
              </h3>

              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-[1024px] w-full divide-y divide-slate-200 bg-white">
                  <thead className="bg-slate-100">
                    <tr>
                      {[
                        "Visit Date",
                        "Purpose",
                        "Sales Person",
                        "Contact Person",
                        "Remark",
                      ].map((header) => (
                        <th
                          key={header}
                          className="p-4 text-left text-sm font-semibold text-slate-600"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lead.visits.map((visit) => (
                      <tr
                        key={visit.id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="p-4 text-sm text-slate-700">
                          {new Date(visit.visitDate).toLocaleDateString()}
                        </td>

                        <td className="p-4 text-sm text-slate-700">
                          {visit.purpose}
                        </td>
                        <td className="p-4 text-sm text-slate-700">
                          {visit.executive?.username || "NA"}
                        </td>
                        <td className="p-4 text-sm text-slate-700">
                          {visit.contactPersonName || "NA"}
                        </td>

                        <td className="p-4 text-sm text-slate-700 max-w-xs">
                          {visit.remarks || "No message"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Follow Ups */}
          {lead.followUps?.length > 0 && (
            <section className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-slate-900 border-b border-slate-300 pb-2">
                Follow Ups
              </h3>
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-[1024px] w-full divide-y divide-slate-200 bg-white">
                  <thead className="bg-slate-100">
                    <tr>
                      {[
                        "Date",
                        "Status",
                        "Message",
                        "Next Step",
                        "Next Followup Date",
                      ].map((header) => (
                        <th
                          key={header}
                          className="p-4 text-left text-sm font-semibold text-slate-600"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lead.followUps.map((followUp) => (
                      <tr
                        key={followUp.id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="p-4 text-sm text-slate-700">
                          {new Date(followUp.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm text-slate-700">
                          {followUp.status}
                        </td>
                        <td className="p-4 text-sm text-slate-700">
                          {followUp.message || "No message"}
                        </td>
                        <td className="p-4 text-sm text-slate-700">
                          {followUp.nextFollowUpStep || "NA"}
                        </td>
                        <td className="p-4 text-sm text-slate-700">
                          {followUp.nextFollowUpDate
                            ? new Date(
                                followUp.nextFollowUpDate
                              ).toLocaleString()
                            : "NA"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-700 mt-10 bg-slate-100 rounded-lg p-6 shadow-inner">
            {lead.executive && (
              <p>
                <span className="font-semibold text-slate-900">Executive:</span>{" "}
                {lead.executive?.username || "Not Assigned"}
              </p>
            )}
            {lead.dealer && (
              <p>
                <span className="font-semibold text-slate-900">Dealer:</span>{" "}
                {lead.dealer?.name || "Not Assigned"}
              </p>
            )}
            <p>
              <span className="font-semibold text-slate-900">Created At:</span>{" "}
              {new Date(lead.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-600 mt-20">
          Loading lead details...
        </p>
      )}
    </div>
  );
}

export default Page;
