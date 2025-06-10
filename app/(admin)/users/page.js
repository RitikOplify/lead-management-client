"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineCheckCircle,
  AiOutlineUserAdd,
  AiOutlineCopy,
} from "react-icons/ai";
import CreateExecutivePopUp from "@/components/popups/CreateExecutivePopUp";
import InviteDealer from "@/components/popups/InviteDealer";
import axios from "@/utils/axios";
import UpdateDealerStatus from "@/components/popups/UpdateDealer";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [isDealerOpen, setDealerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("executive");
  const [editExecutive, setEditExecutive] = useState(null);
  const [editDealer, setEditDealer] = useState(null);

  const { company, dealers, executives } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const approveDealer = async (id) => {
    try {
      toast.loading("Approving dealer...", { toastId: "approve-dealer" });
      const { data } = await axios.post(`/admin/approve-dealer/${id}`);
      // dispatch(UpdateDealerStatus(data.dealer));
      toast.dismiss("approve-dealer");
      toast.success(data.message);
    } catch (error) {
      toast.dismiss("approve-dealer");
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || "Failed to approve dealer.");
    }
  };

  const handleEditExecutive = (executive) => {
    setEditExecutive(executive);
    setOpen(true);
  };

  const handleDeleteExecutive = async (id) => {
    if (!confirm("Are you sure you want to delete this executive?")) return;
    try {
      toast.loading("Deleting executive...", { toastId: "delete-executive" });
      await axios.delete(`/admin/delete-executive/${id}`);
      toast.dismiss("delete-executive");
      toast.success("Executive deleted successfully.");
    } catch (error) {
      toast.dismiss("delete-executive");
      toast.error(
        error.response?.data?.message || "Failed to delete executive."
      );
    }
  };

  const handleEditDealer = (dealer) => {
    setEditDealer(dealer);
    setDealerOpen(true);
  };

  const handleDeleteDealer = async (id) => {
    if (!confirm("Are you sure you want to delete this dealer?")) return;
    try {
      toast.loading("Deleting dealer...", { toastId: "delete-dealer" });
      await axios.delete(`/admin/delete-dealer/${id}`);
      toast.dismiss("delete-dealer");
      toast.success("Dealer deleted successfully.");
    } catch (error) {
      toast.dismiss("delete-dealer");
      toast.error(error.response?.data?.message || "Failed to delete dealer.");
    }
  };

  const closeExecutivePopup = () => {
    setOpen(false);
    setEditExecutive(null);
  };

  const closeDealerPopup = () => {
    setDealerOpen(false);
    setEditDealer(null);
  };

  const handleCopyInviteLink = async () => {
    try {
      const inviteLink = `https://leadmanagement.transmonk.in/new-dealer/${company?.id}`;
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied to clipboard!");
    } catch {
      toast.error("Failed to copy the invite link.");
    }
  };

  return (
    <>
      {isDealerOpen && (
        <UpdateDealerStatus
          dealerId={editDealer.dealer.id}
          onClose={() => setDealerOpen(false)}
        />
      )}

      <div className="bg-white shadow-lg rounded-xl max-w-7xl mx-auto overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto pb-2 border-b border-gray-300 p-4">
          <button
            onClick={() => setActiveTab("executive")}
            className={`whitespace-nowrap px-5 py-2 rounded-md font-semibold transition-colors ${
              activeTab === "executive"
                ? "bg-[#1B2430] text-white shadow-md"
                : "text-[#1B2430] hover:bg-blue-100"
            }`}
            aria-label="Executives Tab"
          >
            Executives
          </button>
          <button
            onClick={() => setActiveTab("dealer")}
            className={`whitespace-nowrap px-5 py-2 rounded-md font-semibold transition-colors ${
              activeTab === "dealer"
                ? "bg-[#1B2430] text-white shadow-md"
                : "text-[#1B2430] hover:bg-blue-100"
            }`}
            aria-label="Dealers Tab"
          >
            Dealers
          </button>
        </div>

        {/* Executive Section */}
        {activeTab === "executive" && (
          <section>
            <div className="flex flex-col md:flex-row justify-between md:items-center py-2 px-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Executives
              </h2>
              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    setEditExecutive(null);
                    setOpen(true);
                  }}
                  className="mt-3 md:mt-0 inline-flex w-fit items-center gap-2 px-6 py-2 bg-[#1B2430] hover:bg-[#2F3E46] text-white rounded-md shadow-md transition"
                  aria-label="Create New Executive"
                >
                  <AiOutlineUserAdd size={20} />
                  Create Executive
                </button>
              )}
            </div>

            <div className="overflow-x-auto shadow-sm">
              {executives?.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-sm font-medium text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-700 w-36">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {executives.map(({ id, username, isActive, email }) => (
                      <tr key={id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              isActive == "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-300 text-gray-700"
                            }`}
                            aria-label={isActive ? "Active" : "Inactive"}
                          >
                            {isActive == "ACTIVE" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex space-x-3">
                          <button
                            onClick={() =>
                              handleEditExecutive({
                                id,
                                username,
                                isActive,
                                email,
                              })
                            }
                            title="Edit Executive"
                            aria-label={`Edit executive ${username}`}
                            className="text-blue-700 hover:text-blue-900 transition"
                          >
                            <AiOutlineEdit size={22} />
                          </button>
                          {/* <button
                          onClick={() => handleDeleteExecutive(id)}
                          title="Delete Executive"
                          aria-label={`Delete executive ${username}`}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <AiOutlineDelete size={22} />
                        </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-3 text-center text-gray-500">
                  No Executives Found
                </p>
              )}
            </div>
          </section>
        )}

        {/* Dealer Section */}
        {activeTab === "dealer" && (
          <section>
            <div className="flex flex-col md:flex-row justify-between md:items-center py-2 px-4">
              <h2 className="text-2xl font-semibold text-gray-900">Dealers</h2>
              {user?.role === "admin" && (
                <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
                  <button
                    onClick={handleCopyInviteLink}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#1B2430] hover:bg-[#2F3E46] text-white rounded-md shadow-md transition"
                    aria-label="Copy Invite Link"
                  >
                    <AiOutlineCopy size={20} />
                    Copy Invite Link
                  </button>

                  {/* Uncomment if Invite Dealer is needed */}
                  {/* <button
                  onClick={() => {
                    setEditDealer(null);
                    setDealerOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md shadow-md transition"
                  aria-label="Invite New Dealer"
                >
                  <AiOutlineUserAdd size={20} />
                  Invite Dealer
                </button> */}
                </div>
              )}
            </div>

            <div className="overflow-x-auto shadow-sm">
              {dealers?.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-sm font-medium text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-700 w-44">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dealers.map(({ id, dealer, status }) => (
                      <tr key={id} className="hover:bg-blue-50">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {dealer.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {dealer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                              status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : status === "INACTIVE"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-300 text-gray-700"
                            }`}
                            aria-label={status}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex flex-wrap items-center gap-3">
                          {status === "INACTIVE" && (
                            <button
                              onClick={() => approveDealer(dealer.id)}
                              title="Approve Dealer"
                              aria-label={`Approve dealer ${dealer.name}`}
                              className="text-green-700 hover:text-green-900 transition"
                            >
                              <AiOutlineCheckCircle size={24} />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleEditDealer({ id, dealer, status })
                            }
                            title="Edit Dealer"
                            aria-label={`Edit dealer ${dealer.name}`}
                            className="text-blue-700 hover:text-blue-900 transition"
                          >
                            <AiOutlineEdit size={24} />
                          </button>

                          {/* <button
                          onClick={() => handleDeleteDealer(id)}
                          title="Delete Dealer"
                          aria-label={`Delete dealer ${dealer.name}`}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <AiOutlineDelete size={24} />
                        </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="p-3 text-center text-gray-500">
                  No Dealers Found
                </p>
              )}
            </div>
          </section>
        )}

        {/* Popups */}
        {open && (
          <CreateExecutivePopUp
            onClose={closeExecutivePopup}
            initialData={editExecutive}
          />
        )}

        {/* {isDealerOpen && (
          <InviteDealer onClose={closeDealerPopup} initialData={editDealer} />
        )} */}
      </div>
    </>
  );
};

export default Page;
