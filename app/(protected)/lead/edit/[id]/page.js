"use client";
import React, { use, useState } from "react";
import CreateLead from "@/components/leads/createLead";

const Page = ({ params }) => {
  const { id } = use(params);
  return <CreateLead leadId={id} />;
};

export default Page;
