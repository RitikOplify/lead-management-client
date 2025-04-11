"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import { asyncGetCompanyDtails } from "@/store/actions/leads";

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(asyncCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      router.replace("/");
    }
  }, [user, isLoading, router]);
  useEffect(() => {
    if (user) {
      dispatch(asyncGetCompanyDtails());
    }
  }, [user, dispatch]);
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return user.role === "admin" ? children : null;
}

export default AdminLayout;
