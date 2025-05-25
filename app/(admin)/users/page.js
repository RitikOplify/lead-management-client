"use client";
import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "@/components/Nav";
import { useSelector, useDispatch } from "react-redux";
import CreateExecutivePopUp from "@/components/popups/CreateExecutivePopUp";
import InviteDealer from "@/components/popups/InviteDealer";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
// import { fetchLeads } from "@/redux/leadsSlice"; // Assuming you have a thunk or action to fetch leads

const Page = () => {
  const [open, setOpen] = useState(false);
  const [isDealerOpen, setDealerOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("executive");
  const [editExecutive, setEditExecutive] = useState(null);
  const [editDealer, setEditDealer] = useState(null);

  const dispatch = useDispatch();

  const { company, dealers, executives } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);

  // Function to reload data after changes
  // const reloadData = () => {
  //   dispatch(fetchLeads()); // Adjust if your fetch leads function has a different name
  // };

  // Approve Dealer API call
  const approveDealer = async (id) => {
    try {
      toast.loading("Updating Dealer.", { toastId: "dealer-loading" });
      const { data } = await axios.post(`/admin/approve-dealer/${id}`);
      toast.dismiss("dealer-loading");
      toast.success(data.message);
      reloadData();
    } catch (error) {
      toast.dismiss("dealer-loading");
      toast.error(error.response?.data?.message || "Failed to approve dealer.");
    }
  };

  // Open Executive popup for editing
  const handleEditExecutive = (executive) => {
    setEditExecutive(executive);
    setOpen(true);
  };

  // Delete Executive API call
  const handleDeleteExecutive = async (executiveId) => {
    if (confirm("Are you sure you want to delete this executive?")) {
      try {
        toast.loading("Deleting Executive...", { toastId: "delete-exec" });
        await axios.delete(`/admin/delete-executive/${executiveId}`);
        toast.dismiss("delete-exec");
        toast.success("Executive deleted successfully.");
      } catch (error) {
        toast.dismiss("delete-exec");
        toast.error(
          error.response?.data?.message || "Failed to delete executive."
        );
      }
    }
  };

  // Open Dealer popup for editing (if you have such feature)
  const handleEditDealer = (dealer) => {
    setEditDealer(dealer);
    setDealerOpen(true);
  };

  // Delete Dealer API call
  const handleDeleteDealer = async (dealerId) => {
    if (confirm("Are you sure you want to delete this dealer?")) {
      try {
        toast.loading("Deleting Dealer...", { toastId: "delete-dealer" });
        await axios.delete(`/admin/delete-dealer/${dealerId}`);
        toast.dismiss("delete-dealer");
        toast.success("Dealer deleted successfully.");
        reloadData();
      } catch (error) {
        toast.dismiss("delete-dealer");
        toast.error(
          error.response?.data?.message || "Failed to delete dealer."
        );
      }
    }
  };

  // Close popup handlers: reset edit states and reload data
  const closeExecutivePopup = () => {
    setOpen(false);
    setEditExecutive(null);
    // reloadData();
  };

  const closeDealerPopup = () => {
    setDealerOpen(false);
    setEditDealer(null);
    // reloadData();
  };

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />

      {open && (
        <CreateExecutivePopUp
          onClose={closeExecutivePopup}
          initialData={editExecutive} // Pass data for edit or null for create
        />
      )}

      {isDealerOpen && (
        <InviteDealer
          onClose={closeDealerPopup}
          initialData={editDealer} // If you want to edit dealers too
        />
      )}

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
                : "bg-gray-200"
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

        {/* Executive Section */}
        {activeTab === "executive" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xl font-semibold">Executive List</h5>
              {user?.role === "admin" && (
                <button
                  className="bg-[#092C1C] text-white px-6 py-2 rounded"
                  onClick={() => {
                    setEditExecutive(null);
                    setOpen(true);
                  }}
                >
                  Create New Executive
                </button>
              )}
            </div>

            <div className="rounded-lg">
              {executives?.length > 0 ? (
                <table className="w-full divide-y divide-gray-200 mt-6 shadow">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {executives.map((executive) => (
                      <tr key={executive.id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-700">
                          {executive.username}
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {executive.isActive ? "Active" : "Inactive"}
                        </td>
                        <td className="p-4 text-sm text-gray-700 flex gap-2">
                          <button
                            onClick={() => handleEditExecutive(executive)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExecutive(executive.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
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

        {/* Dealer Section */}
        {activeTab === "dealer" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xl font-semibold">Dealer List</h5>
              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    setEditDealer(null);
                    setDealerOpen(true);
                  }}
                  className="bg-[#092C1C] text-white px-6 py-2 rounded"
                >
                  Invite New Dealer
                </button>
              )}
            </div>

            <div className="space-y-4">
              {dealers?.length > 0 ? (
                <table className="w-full divide-y divide-gray-200 mt-6 shadow">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dealers.map((dealer) => (
                      <tr key={dealer.id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-700">
                          {dealer.dealer.name}
                        </td>
                        <td className="p-4 text-sm text-gray-700">
                          {dealer.status}
                        </td>
                        <td className="p-4 text-sm text-gray-700 flex flex-wrap gap-2">
                          {dealer.status === "INACTIVE" && (
                            <button
                              onClick={() => approveDealer(dealer.dealer.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleEditDealer(dealer)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDealer(dealer.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Delete
                          </button>
                        </td>
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

export default Page;
