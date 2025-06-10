"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "@/utils/axios";

const Page = () => {
  const [customers, setCustomers] = useState([]);

  async function fetchCustomers() {
    try {
      const { data } = await axios.get(`/admin/customers`);
      setCustomers(data.customers);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch customers.");
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <main className="flex-1 p-4 md:p-6 bg-white overflow-y-auto max-w-7xl mx-auto rounded-xl shadow-sm">
      {/* Page Header */}
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Customers</h1>

      {/* Customer Cards */}
      <section className="grid grid-cols-1 min-w-full sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white p-5 cursor-pointer rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {customer.customerName}
              </h3>
              <p className="text-sm text-gray-600">{customer.email}</p>
              <p className="text-sm text-gray-600">{customer.contact}</p>
              <p className="text-sm text-gray-600">{customer.city}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No customers found.
          </div>
        )}
      </section>
    </main>
  );
};

export default Page;
