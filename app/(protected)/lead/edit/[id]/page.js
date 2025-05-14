"use client";
import React, { useState } from "react";
import Nav from "@/components/Nav";

const Page = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <p>Edit Here!</p>
      </div>
    </div>
  );
};

export default Page;
