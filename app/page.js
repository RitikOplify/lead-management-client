"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/dashboard";
import { asyncGetCompanyDtails } from "@/store/actions/leads";
import AddEntry from "@/components/admin/dashboard2";
import Loader from "@/components/loader";

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
    if (user && user.role == "admin") {
      dispatch(asyncGetCompanyDtails());
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
    return null;
  }

  return <AddEntry />;
}

export default Home;
