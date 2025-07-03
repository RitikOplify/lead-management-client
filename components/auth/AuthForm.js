"use client";
import { asyncSignInUser, asyncSignUpUser } from "@/store/actions/auth";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const AuthForm = ({ type }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // const { email, password, role } = data;
    if (type === "signup") {
      setLoader(true);
      await dispatch(asyncSignUpUser(data));
      setLoader(false);
    } else {
      setLoader(true);
      await dispatch(asyncSignInUser(data));
      setLoader(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold text-green-950 mb-10">
        {type === "signup" ? "Sign Up" : "Sign In"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4 md:w-1/3 lg:w-1/5"
      >
        <div className="flex flex-col">
          <label className="text-sm mb-1">Role</label>
          <div className="relative">
            <select
              {...register("role", {
                required: "Role is required.",
              })}
              className="px-3 py-2 w-full border border-gray-300 rounded-lg appearance-none"
            >
              <option value="">Select Role</option>
              <option value={"admin"}>Admin</option>
              <option value={"executive"}>Executive</option>
              <option value={"dealer"}>Partner</option>
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <IoIosArrowDown size={18} />
            </div>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className=" mb-1">
            Email
          </label>
          <input
            id="email"
            className="px-3 py-2 border border-gray-300 rounded-lg"
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address.",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col relative">
          <label htmlFor="password" className="mb-1">
            Password
          </label>
          <div className=" relative">
            <input
              id="password"
              className="px-3 w-full py-2 border border-gray-300 rounded-lg"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters long.",
                },
              })}
            />
            <button
              type="button"
              className="text-md text-gray-600 absolute top-1/2 transform -translate-y-1/2 right-3 "
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <FaEye
                  onClick={() => {
                    setShowPassword(true);
                  }}
                />
              ) : (
                <FaEyeSlash
                  onClick={() => {
                    setShowPassword(false);
                  }}
                />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {loader ? (
          <button
            disabled
            type="button"
            className="px-3 py-2 rounded-lg bg-green-950 text-white"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Loading...
          </button>
        ) : (
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-green-950 text-white"
          >
            {type === "signup" ? "Sign Up" : "Sign In"}
          </button>
        )}

        <p className="text-center">
          {type === "signup" ? (
            <>
              Already have an account?{" "}
              <Link href="/" className="font-bold">
                Sign In
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/" className="font-bold">
                Sign Up
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
