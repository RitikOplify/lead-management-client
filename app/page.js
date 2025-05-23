"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import {
  asyncAddProducts,
  asyncAddVisits,
  asyncGetAllLeads,
} from "@/store/actions/leads";
import Loader from "@/components/loader";
import LeadDataTable from "@/components/leads/leadTable";
import {
  asyncAddCategory,
  asyncGetDealers,
  asyncGetExecutives,
} from "@/store/actions/admin";

function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if ((user && user.role == "admin") || "executive") {
      dispatch(asyncAddCategory());
      dispatch(asyncAddVisits());
      dispatch(asyncAddProducts());
      dispatch(asyncGetDealers());
      dispatch(asyncGetAllLeads());
      dispatch(asyncGetExecutives());
    }
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
    return (
      <div className=" h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return <LeadDataTable />;
}

export default Home;
