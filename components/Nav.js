"use client";
import { asyncSignOutUser } from "@/store/actions/auth";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  FaSignOutAlt,
  FaTimes,
  FaHome,
  FaPlusCircle,
  FaUsers,
  FaBoxOpen,
  FaChartBar,
  FaTasks,
  FaBuilding,
  FaCalendarCheck,
} from "react-icons/fa";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { MdDashboard, MdCategory } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import SwitchCompany from "./popups/SwitchCompany";

function Nav({ navOpen, setNavOpen }) {
  const dispatch = useDispatch();
  const [switchCompanyOpen, setSwitchCompanyOpen] = useState(false);
  const { user, currentCompany } = useSelector((state) => state.auth);
  const navRef = useRef();

  const logout = async () => {
    await dispatch(asyncSignOutUser());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setNavOpen(false);
      }
    };

    if (navOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navOpen, setNavOpen]);

  const handleCompanyChange = () => {
    setSwitchCompanyOpen(true);
  };

  return (
    <>
      {/* Backdrop for smaller screens */}
      {navOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/10 z-40"
          onClick={() => setNavOpen(false)}
        ></div>
      )}

      {switchCompanyOpen && (
        <SwitchCompany onClose={() => setSwitchCompanyOpen(false)} />
      )}

      <aside
        ref={navRef}
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
          {user && user.role === "dealer" && (
            <p className="p-2 rounded flex items-center gap-2">
              {currentCompany.name}
              <HiOutlineSwitchVertical
                className="cursor-pointer"
                onClick={() => handleCompanyChange()}
              />
            </p>
          )}
          {user && user.role !== "dealer" && (
            <>
              <Link
                href="/"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <FaHome /> Home
              </Link>
              <Link
                href="/new-visit"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <FaPlusCircle />
                New Visit
              </Link>
              <Link
                href="/visits"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <FaCalendarCheck />
                All Visit
              </Link>
              <Link
                href="/dealer-sales-lead"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <FaBuilding /> Dealer Sales Lead
              </Link>
            </>
          )}

          <Link
            href="/new-lead"
            className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
          >
            <FaPlusCircle /> Create Lead
          </Link>

          {user && user.role !== "admin" && (
            <Link
              href="/my-task"
              className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
            >
              <FaTasks /> My Task
            </Link>
          )}

          {user && user.role === "admin" && (
            <>
              <Link
                href="/reports"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <FaChartBar /> Reports
              </Link>
              <Link
                href="/dashboard"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <MdDashboard /> Dashboard
              </Link>

              <Link
                href="/users"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <FaUsers /> Users
              </Link>
              <Link
                href="/category"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <MdCategory /> Category
              </Link>
              <Link
                href="/product"
                className="hover:bg-green-800 p-2 rounded flex items-center gap-2"
              >
                <FaBoxOpen /> Product
              </Link>
            </>
          )}
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
    </>
  );
}

export default Nav;
