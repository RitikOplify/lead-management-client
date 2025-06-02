"use client";
import React, { useState } from "react";
import Nav from "@/components/Nav";
import { FaBars } from "react-icons/fa";

const Page = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>
        <p>Analytics Here!</p>
      </div>
    </div>
  );
};

export default Page;
