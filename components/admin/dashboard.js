"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "../Nav";

import { useDispatch, useSelector } from "react-redux";

import CreateExecutivePopUp from "../popups/CreateExecutivePopUp";
const Dashboard = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const { company } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);

  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      {open && <CreateExecutivePopUp onClose={() => setOpen(false)} />}
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>

        <div>
          <div className=" flex items-center justify-between">
            <h5 className=" mb-3 text-xl font-semibold">Executive List</h5>
            <button
              className="bg-[#092C1C] text-white px-6 py-2 rounded cursor-pointer"
              onClick={() => {
                setOpen(true);
              }}
            >
              Create New Executive
            </button>
          </div>
          <div className="shadow-md rounded-lg p-4">
            {company?.executives?.length > 0 ? (
              <div>
                {company.executives.map((executive) => (
                  <h3 key={executive.id}>{executive.username}</h3>
                ))}
              </div>
            ) : (
              <p>No Executive Found</p>
            )}
          </div>
        </div>

        <div>
          <div className=" flex items-center justify-between">
            <h5 className=" mb-3 text-xl font-semibold">Dealer List</h5>
            <button className="bg-[#092C1C] text-white px-6 py-2 rounded cursor-pointer">
              Create New Dealer
            </button>
          </div>
          <div className="shadow-md rounded-lg p-4">
            {company?.dealers?.length > 0 ? (
              <div>
                {company.dealers.map((dealer) => (
                  <h3 key={dealer.id}>{dealer.name}</h3>
                ))}
              </div>
            ) : (
              <p>No Dealer Found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
