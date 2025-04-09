"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { usePathname, useRouter } from "next/navigation";

function Layout({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser(pathname));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;

  if (user) return null;

  return children;
}

export default Layout;
