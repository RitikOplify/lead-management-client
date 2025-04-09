"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/dashboard";

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
    if (!isLoading && !user) {
      router.replace("/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <AdminDashboard />;
}

export default Home;
