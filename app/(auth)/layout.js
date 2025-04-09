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
  // Fetch current user on mount

  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser(pathname));
    }
  }, [dispatch, user]);

  // Redirect authenticated users
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/"); // or wherever you want to send logged-in users
    }
  }, [user, isLoading, router]);

  // While loading, show nothing
  if (isLoading) return null;

  // If user exists, don't render the page (prevent flicker)
  if (user) return null;

  return children;
}

export default Layout;
