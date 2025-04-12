"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import { asyncGetCompanyDtails } from "@/store/actions/leads";
import Loader from "@/components/loader";

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch]);

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

  if (isLoading)
    return (
      <div className=" h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  if (!user) return null;

  return user.role === "admin" ? children : router.back();
}

export default AdminLayout;
