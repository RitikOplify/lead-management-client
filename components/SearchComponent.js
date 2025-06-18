"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FaEdit,
  FaEye,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { FiInbox } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "@/utils/axios";

// ------------------- Search Results Table -------------------
function SearchResultsTable({ leads, onEditLead, isExpanded, onToggleExpand }) {
  const handleEdit = (leadId) => {
    if (onEditLead) onEditLead(leadId);
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-2 py-12 flex flex-col items-center text-gray-400">
        <FiInbox size={40} />
        <p className="mt-2 text-base font-medium text-gray-600">
          No leads found
        </p>
        <p className="text-sm text-gray-500">Try changing the search query.</p>
      </div>
    );
  }

  const displayLeads = isExpanded ? leads : leads.slice(0, 5);
  const hasMore = leads.length > 5;

  return (
    <div className="bg-white rounded-xl shadow-sm mt-2 pb-5">
      <div className="flex items-center justify-between px-4 rounded-t-xl py-2 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            <FaSearch size={14} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Search Results
            </h3>
            <p className="text-xs text-gray-500">
              Found {leads.length} lead{leads.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {hasMore && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <span>
              {isExpanded ? "Show Less" : `Show All (${leads.length})`}
            </span>
            {isExpanded ? (
              <FaChevronUp size={12} />
            ) : (
              <FaChevronDown size={12} />
            )}
          </button>
        )}
      </div>

      <div className="overflow-x-auto custom-scroller4">
        <table className="w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              {[
                "Enq No",
                "Actions",
                "Enquiry Person",
                "Sales Person",
                "Contact",
                "Company",
                "Status",
                "Source",
                "City",
                "Created",
              ].map((th) => (
                <th
                  key={th}
                  className="p-4 text-left whitespace-nowrap font-semibold"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayLeads.map((lead) => {
              let rowClass = "bg-white text-slate-700 hover:bg-gray-50";

              if (lead.status?.toLowerCase() === "closed") {
                if (lead.finalStatus?.toLowerCase() === "converted") {
                  rowClass = "bg-green-100 text-green-900";
                } else if (lead.finalStatus?.toLowerCase() === "lost") {
                  rowClass = "bg-rose-100 text-rose-900";
                }
              } else if (lead.nextFollowUpDate) {
                const nextDate = new Date(lead.nextFollowUpDate);
                const now = new Date();
                const timeDiff = nextDate - now;

                if (nextDate < now) {
                  rowClass = "bg-amber-100 text-amber-900";
                } else if (timeDiff <= 86400000) {
                  rowClass = "bg-yellow-50 text-yellow-900";
                } else {
                  rowClass = "bg-blue-50 text-blue-900";
                }
              }

              return (
                <tr key={lead.id} className={`${rowClass} transition`}>
                  <td className="p-4 whitespace-nowrap">
                    {lead.enqNo || "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(lead.id)}
                        className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                      >
                        <FaEdit size={12} />
                      </button>
                      <Link href={`/lead/${lead.id}`}>
                        <button className="text-green-600 hover:bg-green-100 p-1 rounded">
                          <FaEye size={12} />
                        </button>
                      </Link>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {lead.enquiryPerson || "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {lead.executive?.username || "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {lead.customer?.contact || "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {lead.customer?.customerName || "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {lead.status?.toLowerCase() === "closed"
                      ? `${lead.status} (${lead.finalStatus})`
                      : lead.status}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {lead.source || "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {lead.customer?.city || "N/A"}
                  </td>
                  <td className="p-4 whitespace-nowrap text-gray-500">
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && !isExpanded && (
        <div className="p-3 border-t text-center">
          <button
            onClick={onToggleExpand}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Show {leads.length - 5} more results
          </button>
        </div>
      )}
    </div>
  );
}

// ------------------- Main Component -------------------
function LeadSearchComponent({
  placeholder = "Search existing leads...",
  title = "Quick Search",
  onEditLead,
  className = "",
  variant = "default", // "default" | "compact" | "inline"
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimeout = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }

    if (searchQuery.trim().length % 3 === 0) performSearch();
    else {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(performSearch, 1000);
    }

    async function performSearch() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/lead/search?query=${searchQuery}`);
        setSearchResults(data.leads);
        setShowResults(true);
        setIsExpanded(false);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Search failed");
        setSearchResults([]);
        setShowResults(true);
      } finally {
        setIsLoading(false);
      }
    }

    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults(null);
    setShowResults(false);
    setIsExpanded(false);
  };

  const searchBox = (
    <div className="relative">
      <FaSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={16}
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchResults && setShowResults(true)}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <IoClose size={16} />
        </button>
      )}
      {isLoading && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {variant === "default" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-blue-700">
            <FaSearch />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          {searchBox}
        </div>
      )}

      {(variant === "compact" || variant === "inline") && searchBox}

      {showResults && searchResults && (
        <div
          className={
            variant === "default"
              ? "mt-4"
              : "absolute top-full left-0 right-0 z-50"
          }
        >
          <SearchResultsTable
            leads={searchResults}
            onEditLead={onEditLead}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />
        </div>
      )}
    </div>
  );
}

export default LeadSearchComponent;
