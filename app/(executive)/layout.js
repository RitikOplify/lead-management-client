"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import {
  asyncAddProducts,
  asyncAddVisits,
  asyncGetAllLeads,
} from "@/store/actions/leads";
import {
  asyncAddCategory,
  asyncGetDealers,
  asyncGetExecutives,
} from "@/store/actions/admin";
import Loader from "@/components/loader";
import Nav from "@/components/Nav";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { usePathname } from "next/navigation";

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!user || !user.role) return;

    const fetchCommonData = () => {
      dispatch(asyncAddCategory());
      dispatch(asyncAddProducts());
    };

    const fetchRoleBasedData = () => {
      if (user.role === "admin" || user.role === "executive") {
        dispatch(asyncAddVisits());
        dispatch(asyncGetDealers());
        dispatch(asyncGetAllLeads());
        dispatch(asyncGetExecutives());
      }
    };

    fetchCommonData();
    fetchRoleBasedData();
  }, [user, dispatch]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "executive") {
      router.back();
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "executive")) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <main className="flex-1 overflow-auto p-6 transition-all bg-gray-100 duration-300 ease-in-out">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#1B2430] p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        </div>
        <div className="mb-4 text-sm text-gray-600 flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center space-x-1 text-blue-600 hover:underline"
          >
            <FaHome />
            <span>Home</span>
          </Link>
          <IoIosArrowForward />
          <span className="capitalize">
            {pathname.split("/").filter(Boolean).slice(-1)[0]}
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
