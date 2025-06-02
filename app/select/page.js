"use client";
import CreatableSelectInput from "@/components/CustomSelect";
import React from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CreatableSelectInput
          control={control}
          name="fruit"
          label="Choose or Add a Fruit"
          placeholder="Select or create..."
          options={[{ label: "Reading", value: "reading" }, { label: "Writing", value: "writing" }]}
        />

        <CreatableSelectInput
          control={control}
          placeholder="Select or create..."
          name="hobbies"
          label="Select or Add Multiple Hobbies"
          options={[{ label: "Reading", value: "reading" }]}
          isMulti
        />

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
