"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input, Select } from "../inputFields";
import { useSelector } from "react-redux";
import CustomSelect from "../CustomCreatableSelectInner";
import * as XLSX from "xlsx";
import axios from "@/utils/axios";

const DownloadLeadsModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const { executives } = useSelector((state) => state.leads);

  const generateExcel = (leads) => {
    const data = leads.map((lead) => ({
      "Enq number": lead.enqNo || "NA",
      "Enq Person": lead.enquiryPerson || "NA",
      "Sales Person": lead.executive?.username || "NA",
      Dealer: lead.dealer?.name || "NA",
      Contact: lead?.contact || lead.customer?.contact || "NA",
      Email: lead?.email || lead.customer?.email || "NA",
      Company: lead.customer?.customerName || "NA",
      Status: lead.status || "NA",
      Source: lead.source || "NA",
      City: lead?.city || lead.customer?.city || "NA",
      "Date Created": new Date(lead.createdAt).toLocaleDateString("en-GB"),
      "Last Update": new Date(lead.updatedAt).toLocaleDateString("en-GB"),
      Products: lead.products?.map((p) => p.name).join(", ") || "NA",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const headers = Object.keys(data[0]);
    const colWidths = headers.map((header) => {
      const maxLength = Math.max(
        header.length,
        ...data.map((row) => row[header]?.toString().length || 0)
      );
      return { wch: maxLength + 5 };
    });
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leads.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/lead/filter-leads", formData);
      if (!data.leads || data.leads.length === 0) {
        toast.error("Oops! No leads match your filters. Try adjusting them.");
        return;
      }

      generateExcel(data.leads);
      toast.success("Leads exported successfully!");
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to export leads");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white h-screen sm:h-auto md:rounded-xl shadow-2xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-black transition-colors"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-center text-slate-800">
          Export Leads to Excel
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <CustomSelect
            control={control}
            name="executiveId"
            label="Select Executive"
            options={
              executives?.map((exec) => ({
                label: exec.username,
                value: exec.id,
              })) || []
            }
            isMulti
            placeholder="Select Executive"
          />

          <CustomSelect
            control={control}
            name="status"
            label="Select Status"
            options={[
              "NEW",
              "FOLLOW_UP",
              "OPEN",
              "TECHNICAL_DISCUSSION",
              "QUOATION",
              "NEGOTIATION",
              "CLOSED",
            ].map((status) => ({ value: status, label: status }))}
            isMulti
            placeholder="Select Status"
          />

          <Select
            label="Final Status"
            name="finalStatus"
            register={register}
            options={[
              { value: "CONVERTED", label: "CONVERTED" },
              { value: "LOST", label: "LOST" },
            ]}
          />

          <Input
            label="Start Date"
            name="startDate"
            type="date"
            register={register}
            error={errors.startDate}
          />

          <Input
            label="End Date"
            name="endDate"
            type="date"
            register={register}
            error={errors.endDate}
          />

          <div className="flex justify-end pt-2">
            {loading ? (
              <button
                type="button"
                disabled
                className="bg-slate-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 cursor-not-allowed"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                >
                  <path d="M100 50.5908..." fill="#E5E7EB" />
                  <path d="M93.9676 39.0409..." fill="currentColor" />
                </svg>
                Exporting...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Download Excel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DownloadLeadsModal;
