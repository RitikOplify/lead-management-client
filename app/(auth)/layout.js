"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

function Layout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role == "dealer") {
        router.replace("/my-task");
      }
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading)
    return (
      <div className=" h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  if (user) return null;

  return children;
}

export default Layout;
