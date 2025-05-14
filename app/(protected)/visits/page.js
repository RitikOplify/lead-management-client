"use client";
import axios from "@/utils/axios";
import React, { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Link from "next/link";

const page = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [visits, setVisits] = useState([]);
  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const { data } = await axios.get(`/visit`);
        console.log(data);
        setVisits(data.visits);
        console.log(data);
      } catch (error) {
        console.log(error.response.data.message);
        console.error("Error fetching lead details:", error);
      }
    };
    fetchVisits();
  }, []);
  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />
      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <h1>Vists</h1>
        {visits.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Company Name</th>
                <th className="text-left">Customer Name</th>
                <th className="text-left">Purpose</th>
                <th className="text-left">Visit Date</th>
                <th className="text-left">Lead</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td>{visit.companyName}</td>
                  <td>{visit.customerName}</td>
                  <td>{visit.purpose}</td>
                  <td>
                    {new Date(visit.visitDate).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    {visit.leadId ? (
                      <Link
                        href={`/lead/${visit.leadId}`}
                        className="text-blue-500"
                      >
                        View Lead
                      </Link>
                    ) : (
                      <span className="text-red-500">No Lead</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No visits found.</p>
        )}
      </div>
    </div>
  );
};

export default page;
