"use client";
import { asyncSignOutUser } from "@/store/actions/auth";
import Link from "next/link";
import React from "react";
import { FaSignOutAlt, FaTimes, FaHome, FaPlus } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";

import { useDispatch } from "react-redux";
function Nav({ navOpen, setNavOpen }) {
  const dispatch = useDispatch();

  const logout = async () => {
    await dispatch(asyncSignOutUser());
  };
  return (
    <aside
      className={`bg-[#092C1C] text-white flex flex-col p-4 space-y-6 fixed md:static top-0 left-0 h-full w-64 z-50 transition-transform transform ${
        navOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex justify-between items-center md:hidden">
        <h2 className="text-2xl font-bold">Logo</h2>
        <button
          onClick={() => setNavOpen(false)}
          className="text-white text-2xl"
        >
          <FaTimes />
        </button>
      </div>
      <nav className="flex flex-col space-y-4 mt-4 md:mt-0">
        <Link
          href="/"
          className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
        >
          <FaHome /> Home
        </Link>
        <Link
          href="/new-lead"
          className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Create Lead
        </Link>

        <Link
          href="/dashboard"
          className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
        >
          <MdOutlineDashboard />
          Dashborad
        </Link>
      </nav>
      <div className="mt-auto">
        <button
          className="text-sm hover:underline flex items-center gap-2 cursor-pointer"
          onClick={logout}
        >
          <FaSignOutAlt /> Signout
        </button>
      </div>
    </aside>
  );
}

export default Nav;
