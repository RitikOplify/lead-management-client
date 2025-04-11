"use client";
import Nav from "@/components/Nav";
import React, { use, useEffect, useState } from "react";
import axios from "@/utils/axios";
import URL from "@/utils/config";

function page({ params }) {
  const { id } = use(params);
  const [lead, setLead] = useState();

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const { data } = await axios.get(`${URL}/lead/${id}`);
        setLead(data.lead);
        console.log(data.lead);
      } catch (error) {
        console.error("Error fetching lead details:", error);
      }
    };
    fetchLeadDetails();
  }, []);

  return (
    <div className="flex h-screen max-w-[1440px] mx-auto">
      <Nav />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] overflow-y-auto custom-scroller2">
        {lead ? (
          <div className="bg-white">
            <h2 className="text-2xl font-semibold">Lead Details</h2>

            {/* Lead Information */}
            <div className="shadow-md rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-medium mb-2">Personal Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Name:</span> {lead.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {lead.email}
                </p>
                <p>
                  <span className="font-medium">Contact:</span> {lead.contact}
                </p>
                <p>
                  <span className="font-medium">City:</span> {lead.city}
                </p>
                <p>
                  <span className="font-medium">State:</span> {lead.state}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {lead.status}
                </p>
                <p>
                  <span className="font-medium">Stage:</span> {lead.stage}
                </p>
                <p>
                  <span className="font-medium">Source:</span> {lead.source}
                </p>
                <p>
                  <span className="font-medium">Price:</span> ₹
                  {lead.price?.toLocaleString()}
                </p>
                <p>
                  <span className="font-medium">Comments:</span> {lead.comments}
                </p>
              </div>
            </div>

            {/* Product Info */}
            <div className="shadow-md rounded-lg p-6 space-y-6 mt-6">
              <h3 className="text-lg font-medium mb-2">Product Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Product Name:</span>{" "}
                  {lead.product?.name}
                </p>
                <p>
                  <span className="font-medium">Product ID:</span>{" "}
                  {lead.product?.id}
                </p>
                <p>
                  <span className="font-medium">Category ID:</span>{" "}
                  {lead.product?.category?.name}
                </p>
                <p>
                  <span className="font-medium">Subcategory ID:</span>{" "}
                  {lead.product?.subcategory?.name}
                </p>
              </div>
            </div>

            {/* Follow Ups */}
            {lead.followUps && lead.followUps.length > 0 && (
              <div className="shadow-md rounded-lg space-y-6 mt-6">
                <h3 className="text-lg font-medium mb-2 p-3">Follow Ups</h3>
                <div className="space-y-4 overflow-y-auto custom-scroller">
                  <table className="min-w-[568px] w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Date
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Time
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Status
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Stage
                        </th>
                        <th className="p-4 text-left text-sm font-semibold text-gray-600">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {lead.followUps.map((followUp, index) => (
                        <tr key={followUp.id} className="hover:bg-gray-50">
                          <td className="p-4 text-sm text-gray-700">
                            {new Date(followUp.date).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {followUp.time}
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {followUp.status}
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {followUp.stage}
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {followUp.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Optional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 shadow-md rounded-lg p-6 mt-6">
              <p>
                <span className="font-medium">Executive:</span>{" "}
                {lead.executive?.name || "Not Assigned"}
              </p>
              <p>
                <span className="font-medium">Dealer:</span>{" "}
                {lead.dealer?.name || "Not Assigned"}
              </p>
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

export default page;
