"use client";
import React, { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { toast } from "react-toastify";
import axios from "@/utils/axios";
import { FaBars } from "react-icons/fa";

const Page = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  async function fetchCustomers() {
    try {
      const { data } = await axios.get(`/admin/customers`);
      setCustomers(data.customers);
      console.log("customers", data.customers);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    fetchCustomers();
  }, []);
  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>
        <h1 className=" font-bold">Customers</h1>

        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.length > 0 ? (
            customers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white p-4 space-y-1.5 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold">
                  {customer.customerName}
                </h3>
                <p className="text-gray-600">{customer.email}</p>
                <p className="text-gray-600">{customer.contact}</p>
                <p className="text-gray-600">{customer.city}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No customers found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
