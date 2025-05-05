"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "../Nav";
import { useSelector } from "react-redux";
import CreateExecutivePopUp from "../popups/CreateExecutivePopUp";
import CreateProductForm from "../popups/CreateProduct";
import CreateCategoryForm from "../popups/CreateCategory";
import CreateSubcategoryForm from "../popups/CreateSubCategory";
import InviteDealer from "../popups/InviteDealer";
import axios from "@/utils/axios";
import { toast } from "react-toastify";
const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const { company } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [isProductOpen, setProductOpen] = useState(false);
  const [isDealerOpen, setDealerOpen] = useState(false);

  const [navOpen, setNavOpen] = useState(false);
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

      {categoryOpen && (
        <CreateCategoryForm onCategoryClose={() => setCategoryOpen(false)} />
      )}
      {subCategoryOpen && (
        <CreateSubcategoryForm onClose={() => setSubCategoryOpen(false)} />
      )}

      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            className="bg-[#092C1C] text-white px-6 py-2 rounded cursor-pointer"
            onClick={() => {
              setCategoryOpen(true);
            }}
          >
            Create Category
          </button>
          <button
            className="bg-[#092C1C] text-white px-6 py-2 rounded cursor-pointer"
            onClick={() => {
              setSubCategoryOpen(true);
            }}
          >
            Create Sub Category
          </button>
          <button
            className="bg-[#092C1C] text-white px-6 py-2 rounded cursor-pointer"
            onClick={() => {
              setProductOpen(true);
            }}
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
