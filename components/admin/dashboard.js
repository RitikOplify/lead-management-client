import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { asyncSignOutUser } from "@/store/actions/auth";
import { useForm } from "react-hook-form";
import {
  asyncCreateExecutive,
  asyncGetDealers,
  asyncGetExecutive,
} from "@/store/actions/admin";

export default function AdminDashboard() {
  const { user, isLoading } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("executives");
  const logout = async () => {
    await dispatch(asyncSignOutUser());
  };

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace("/signin");
    }
  }, [user, isLoading, router, dispatch]);

  // if (isLoading) return;

  // if (user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("executives")}
          className={`px-4 py-2 rounded ${
            activeTab === "executives"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Executives
        </button>
        <button
          onClick={() => setActiveTab("dealers")}
          className={`px-4 py-2 rounded ${
            activeTab === "dealers"
              ? "bg-blue-600 text-white"
              : "bg-white border"
          }`}
        >
          Dealers
        </button>
      </div>

      {activeTab === "executives" && <ExecutivesSection />}
      {activeTab === "dealers" && <DealersSection />}

      <LeadsSection />
    </div>
  );
}

function ExecutivesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CreateExecutiveForm />
      <ExecutiveList />
    </div>
  );
}

function CreateExecutiveForm() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(asyncCreateExecutive(data));
  };
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Create Executive</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-2"
      >
        <div className="col-span-1">
          <input
            placeholder="Name"
            className="w-full border p-2 rounded"
            {...register("username", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="col-span-1">
          <input
            placeholder="Email"
            className="w-full border p-2 rounded"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <input
            placeholder="Password"
            className="w-full border p-2 rounded"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button className="bg-green-500 p-2 text-white rounded col-span-2">
          Create
        </button>
      </form>
    </div>
  );
}

function ExecutiveList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.role === "admin") dispatch(asyncGetExecutive());
  }, []);
  const { executives } = useSelector((state) => state.admin);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Executive List</h2>
      <ul className="space-y-2">
        {executives.map((executive) => {
          return (
            <li key={executive.id} className="p-2 border rounded">
              {executive.username} - {executive.email}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DealersSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* <CreateDealerForm /> */}
      <DealerList />
    </div>
  );
}

function CreateDealerForm() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Create Dealer</h2>
      <form className="space-y-3">
        <input
          placeholder="Dealer Name"
          className="w-full border p-2 rounded"
        />
        <input placeholder="Company" className="w-full border p-2 rounded" />
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}

function DealerList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(asyncGetDealers());
  }, []);
  const { dealers } = useSelector((state) => state.admin);
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Dealer List</h2>
      <ul className="space-y-2">
        {dealers.map((dealer) => {
          return (
            <li key={dealer.id} className="p-2 border rounded">
              {dealer.name} - {dealer.email}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LeadsSection() {
  return (
    <div className="bg-white p-4 mt-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">All Leads</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Lead Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Assigned To</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border">Ravi Kumar</td>
            <td className="p-2 border">ravi@lead.com</td>
            <td className="p-2 border">John Doe</td>
            <td className="p-2 border">New</td>
          </tr>
          <tr>
            <td className="p-2 border">Neha Sharma</td>
            <td className="p-2 border">neha@lead.com</td>
            <td className="p-2 border">Jane Smith</td>
            <td className="p-2 border">In Progress</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
