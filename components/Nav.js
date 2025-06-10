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
  FaUserTie,
} from "react-icons/fa";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import { MdCategory } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import SwitchCompany from "./popups/SwitchCompany";
import Image from "next/image";

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

  const navLinks = [
    ...(user?.role !== "dealer"
      ? [{ href: "/", icon: <FaHome />, label: "Home" }]
      : []),
    { href: "/new-lead", icon: <FaPlusCircle />, label: "Create Lead" },
    ...(user?.role !== "dealer"
      ? [
          { href: "/new-visit", icon: <FaPlusCircle />, label: "New Visit" },
          { href: "/visits", icon: <FaCalendarCheck />, label: "All Visits" },
          { href: "/customer", icon: <FaUsers />, label: "Customer Details" },
          {
            href: "/dealer-sales-lead",
            icon: <FaBuilding />,
            label: "Partner's Sales Lead",
          },
        ]
      : []),
    ...(user?.role !== "admin"
      ? [{ href: "/my-task", icon: <FaTasks />, label: "My Tasks" }]
      : []),
    ...(user?.role === "admin"
      ? [
          { href: "/analytics", icon: <FaChartBar />, label: "Analytics" },
          { href: "/users", icon: <FaUsers />, label: "Users" },
          { href: "/product", icon: <FaBoxOpen />, label: "Products" },
          { href: "/category", icon: <MdCategory />, label: "Category" },
        ]
      : []),
  ];

  return (
    <>
      {navOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setNavOpen(false)}
        />
      )}

      {switchCompanyOpen && (
        <SwitchCompany onClose={() => setSwitchCompanyOpen(false)} />
      )}

      <aside
        ref={navRef}
        className={`bg-[#1B2430] text-white w-64 flex flex-col fixed md:static top-0 left-0 h-full z-50 transition-transform duration-300
          ${navOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center md:hidden p-4 border-b border-gray-700">
          <Image src={"/logo-192x192.png"} height={20} width={20} alt="logo" />
          <button
            onClick={() => setNavOpen(false)}
            className="text-white text-xl hover:text-gray-300 transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex pl-7 border-b border-gray-700">
          <Image src={"/logo-192x192.png"} height={50} width={50} alt="logo" />
        </div>

        {/* Dealer Company Switch */}
        {user?.role === "dealer" && (
          <div className="p-4">
            <button
              className="w-full p-3 rounded-lg flex items-center gap-3 hover:bg-green-700/80 hover:shadow-md transition-all"
              onClick={() => setSwitchCompanyOpen(true)}
              title="Switch Company"
            >
              <FaUserTie size={20} />
              <span className="flex-1 truncate text-left">
                {currentCompany?.name}
              </span>
              <HiOutlineSwitchVertical size={20} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 flex flex-col p-4 space-y-2">
          {navLinks.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => window.innerWidth < 768 && setNavOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium hover:bg-green-700/80 hover:shadow-md transition-all"
            >
              <span className="text-lg">{icon}</span>
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium hover:bg-red-700/80 hover:shadow-md transition-all"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Nav;
