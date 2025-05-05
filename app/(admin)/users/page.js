"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "@/components/Nav";
import { useSelector } from "react-redux";
import CreateExecutivePopUp from "@/components/popups/CreateExecutivePopUp";
import InviteDealer from "@/components/popups/InviteDealer";
import axios from "@/utils/axios";
import { toast } from "react-toastify";

const User = () => {
  const [open, setOpen] = useState(false);
  const [isDealerOpen, setDealerOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("executive");

  const { company } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);

  const approveDealer = async (id) => {
    try {
      toast.loading("Updating Dealer.", { toastId: "dealer-loading" });
      const { data } = await axios.post(`/admin/approve-dealer/${id}`);
      toast.dismiss("dealer-loading");
      toast.success(data.message);
      reset();
    } catch (error) {
      toast.dismiss("dealer-loading");
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />

      {open && <CreateExecutivePopUp onClose={() => setOpen(false)} />}
      {isDealerOpen && <InviteDealer onClose={() => setDealerOpen(false)} />}

      <div className="p-6 w-full lg:w-[calc(100%-256px)] overflow-y-auto">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <button
            className={`px-6 py-2 rounded cursor-pointer ${
              activeTab === "executive"
                ? "bg-[#092C1C] text-white"
                : "bg-gray-200 "
            }`}
            onClick={() => setActiveTab("executive")}
          >
            Executives
          </button>
          <button
            className={`px-6 py-2 rounded cursor-pointer ${
              activeTab === "dealer" ? "bg-[#092C1C] text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("dealer")}
          >
            Dealers
          </button>
        </div>

        {activeTab === "executive" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xl font-semibold">Executive List</h5>
              {user?.role === "admin" && (
                <button
                  className="bg-[#092C1C] text-white px-6 py-2 rounded"
                  onClick={() => setOpen(true)}
                >
                  Create New Executive
                </button>
              )}
            </div>
            <div className="rounded-lg p-4">
              {company?.executives?.length > 0 ? (
                <table className="w-full divide-y divide-gray-200 mt-6 shadow">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" divide-y divide-gray-200">
                    {company.executives.map((executive) => (
                      <tr key={executive.id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-700">
                          {executive.username}
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {executive.isActive}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No Executive Found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "dealer" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xl font-semibold">Dealer List</h5>
              {user?.role === "admin" && (
                <button
                  onClick={() => setDealerOpen(true)}
                  className="bg-[#092C1C] text-white px-6 py-2 rounded"
                >
                  Invite New Dealer
                </button>
              )}
            </div>
            <div className="p-4 space-y-4">
              {company?.dealers?.length > 0 ? (
                <table className="w-full divide-y divide-gray-200 mt-6 shadow">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className=" divide-y divide-gray-200">
                    {company.dealers.map((dealer) => (
                      <tr key={dealer.id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-700">
                          {dealer.name}
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {dealer.status}
                        </td>
                        {dealer.status === "INACTIVE" && (
                          <td
                            className="p-4 text-sm rounded-full py-1 bg-green-500 text-gray-700"
                            onClick={() => approveDealer(dealer.id)}
                          >
                            Approve Dealer
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No Dealer Found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
