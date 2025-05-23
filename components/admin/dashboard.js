"use client";
import React, { useState } from "react";
import Nav from "../Nav";

const Dashboard = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <p>Dashborad Here!</p>
      </div>
    </div>
  );
};

export default Dashboard;
