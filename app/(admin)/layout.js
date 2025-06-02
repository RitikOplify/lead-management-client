"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import { asyncAddProducts } from "@/store/actions/leads";
import Loader from "@/components/loader";
import {
  asyncAddCategory,
  asyncGetDealers,
  asyncGetExecutives,
} from "@/store/actions/admin";

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      dispatch(asyncAddCategory());
      dispatch(asyncAddProducts());
      dispatch(asyncGetDealers());
      dispatch(asyncGetExecutives());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && user.role !== "admin") {
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

  if (!user || user.role !== "admin") return null;

  return children;
}

export default AdminLayout;
