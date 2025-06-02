"use client";
import Nav from "@/components/Nav";
import React, { use, useEffect, useState } from "react";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
import Loader from "@/components/loader";
import { useSelector } from "react-redux";
import Link from "next/link";
import CreateFollowUp from "@/components/popups/createFollowUp";
import { FaBars } from "react-icons/fa";

function Page({ params }) {
  const { id } = use(params);
  const [lead, setLead] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/lead/${id}`);
        setLead(data.lead);
        setLoading(false);
        console.log(data.lead);
      } catch (error) {
        setLoading(false);
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
        console.error("Error fetching lead details:", error);
      }
    };
    fetchLeadDetails();
  }, []);
  const [open, setOpen] = useState(false);

  const [leadId, setLeadId] = useState(null);
  const followUpClick = (leadId) => {
    setLeadId(leadId);
    if (!leadId) return;
    setOpen(true);
  };

    const [navOpen, setNavOpen] = useState(false);


  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />

      {open && <CreateFollowUp onClose={() => setOpen(false)} id={leadId} />}

      <div className="p-6 w-full lg:w-[calc(100%-256px)] overflow-y-auto custom-scroller2">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>
        {loading ? (
          <div className=" h-screen flex justify-center items-center">
            <Loader />
          </div>
        ) : lead ? (
          <div className="bg-white">
            <div>
              <div className=" flex justify-between mb-2">
                <h2 className="text-2xl font-semibold ">Lead Details</h2>
                <div className=" flex gap-4">
                  <Link
                    href={`/new-visit?leadId=${lead.id}`}
                    className="bg-[#092C1C] text-white px-3 py-2 rounded cursor-pointer flex items-center"
                  >
                    Add Visit
                  </Link>
                  <h3
                    className="bg-[#092C1C] text-white px-3 py-2 rounded cursor-pointer flex items-center"
                    onClick={() => {
                      followUpClick(lead.id);
                    }}
                  >
                    Add Followup
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 shadow-md rounded-lg p-4">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {lead?.customer?.customerName || "NA"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {lead.customer?.email}
                </p>
                <p>
                  <span className="font-medium">Contact:</span>{" "}
                  {lead.customer?.contact}
                </p>
                <p>
                  <span className="font-medium">City:</span> {lead.city}
                </p>
                <p>
                  <span className="font-medium">State:</span>{" "}
                  {lead.state || "NA"}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {lead.status}
                </p>
                <p>
                  <span className="font-medium">Final Status:</span>{" "}
                  {lead.finalStatus || "NA"}
                </p>
                <p>
                  <span className="font-medium">Source:</span>{" "}
                  {lead.source || "NA"}
                </p>
                <p>
                  <span className="font-medium">Price: </span>
                  {`${
                    lead.price?.toLocaleString()
                      ? `${lead.price?.toLocaleString()}  ₹`
                      : "NA"
                  }`}
                </p>
                <p>
                  <span className="font-medium">Comments:</span>{" "}
                  {lead.comments || "NA"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2 ">Product Info</h3>
              {lead.products?.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 shadow-md rounded-lg p-4"
                >
                  <p>
                    <span className="font-medium">Product Name:</span>{" "}
                    {product.name}
                  </p>
                </div>
              ))}
            </div>

            {lead.categories?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 ">Categories</h3>
                {lead.categories?.map((cat) => (
                  <div
                    key={cat.id}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 shadow-md rounded-lg p-4"
                  >
                    <p>
                      <span className="font-medium">Category Name:</span>{" "}
                      {cat.name}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {lead.visits && lead.visits.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 ">Visits Info</h3>
                {lead.visits?.map((visit) => (
                  <div
                    key={visit.id}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 shadow-md rounded-lg p-4"
                  >
                    <p>
                      <span className="font-medium">Visit Date:</span>{" "}
                      {new Date(visit.visitDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Purpose:</span>{" "}
                      {visit.purpose}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {lead.followUps && lead.followUps.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Follow Ups</h3>
                <div className="space-y-4 overflow-y-auto custom-scroller shadow-md rounded-lg">
                  <table className="min-w-[1024px] w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Date
                        </th>

                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Status
                        </th>

                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Message
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Next Step
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Next Followup Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" divide-y divide-gray-200">
                      {lead.followUps.map((followUp, index) => (
                        <tr key={followUp.id} className="hover:bg-gray-50">
                          <td className="p-4 text-sm text-gray-700">
                            {new Date(followUp.createdAt).toLocaleDateString()}
                          </td>

                          <td className="p-4 text-sm text-gray-700">
                            {followUp.status}
                          </td>

                          <td className="p-4 text-sm text-gray-700">
                            {followUp.message || "No message"}
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {followUp.nextFollowUpStep || "NA"}
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {new Date(
                              followUp.nextFollowUpDate
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 shadow-md rounded-lg p-6 mt-6">
              {lead.executive && (
                <p>
                  <span className="font-medium">Executive:</span>{" "}
                  {lead.executive?.username || "Not Assigned"}
                </p>
              )}
              {lead.dealer && (
                <p>
                  <span className="font-medium">Dealer:</span>{" "}
                  {lead.dealer?.name || "Not Assigned"}
                </p>
              )}
              <p>
                <span className="font-medium">Created At:</span>{" "}
                {new Date(lead.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p>Loading lead details...</p>
        )}
      </div>
    </div>
  );
}

export default Page;
