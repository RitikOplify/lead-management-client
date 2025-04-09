"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  // Fetch user on mount
  useEffect(() => {
    dispatch(asyncCurrentUser());
  }, [dispatch]);

  // Redirect if user is not admin
  useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  // While loading OR user is not yet fetched, don't show anything
  if (isLoading || !user) return null;

  // If user is admin, show children
  return user.role === "admin" ? children : null;
}

export default AdminLayout;
