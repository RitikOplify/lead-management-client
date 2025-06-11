"use client";
import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import {
  asyncAddProducts,
  asyncAddVisits,
  asyncGetAllLeads,
} from "@/store/actions/leads";
import Loader from "@/components/loader";
import {
  asyncAddCategory,
  asyncGetDealers,
  asyncGetExecutives,
} from "@/store/actions/admin";
import Nav from "@/components/Nav";

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading, currentCompany } = useSelector(
    (state) => state.auth
  );
  const [navOpen, setNavOpen] = useState(false);

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

  if (isLoading) {
    return (
      <div className=" h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return null;
  }
  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <main className="flex-1 overflow-auto p-6 bg-gray-100 transition-all duration-300 ease-in-out">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#1B2430] p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
