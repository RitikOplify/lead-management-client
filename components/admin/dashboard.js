import { useEffect, useState } from "react";
import axios from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeUser, setLoading } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
export default function AdminDashboard() {
  const { user, isLoading } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("executives");
  const logout = async () => {
    try {
      dispatch(setLoading(true)); // ✅ correct way
      const { data } = await axios.get("/admin/logout");
      if (data.success) {
        dispatch(removeUser()); // ✅ correct way
        dispatch(setLoading(false));
        toast.warn(data.message, { toastId: "logout" });
        router.replace("/signin");
      } else {
        dispatch(setLoading(false));
        toast.error("Logout failed. Please try again.");
      }
    } catch (err) {
      dispatch(setLoading(false));
      console.error(err);
      toast.error("Something went wrong during logout.");
    }
  };
  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace("/signin");
    }
  }, [user, isLoading, router]);

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
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-2 rounded ${
            activeTab === "leads" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Leads
        </button>
      </div>

      {activeTab === "executives" && <ExecutivesSection />}
      {activeTab === "dealers" && <DealersSection />}
      {activeTab === "leads" && <LeadsSection />}
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
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Create Executive</h2>
      <form className="space-y-3">
        <input placeholder="Name" className="w-full border p-2 rounded" />
        <input placeholder="Email" className="w-full border p-2 rounded" />
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}

function ExecutiveList() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Executive List</h2>
      <ul className="space-y-2">
        <li className="p-2 border rounded">John Doe - john@example.com</li>
        <li className="p-2 border rounded">Jane Smith - jane@example.com</li>
      </ul>
    </div>
  );
}

function DealersSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CreateDealerForm />
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
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Dealer List</h2>
      <ul className="space-y-2">
        <li className="p-2 border rounded">ABC Corp - abc@dealer.com</li>
        <li className="p-2 border rounded">XYZ Ltd - xyz@dealer.com</li>
      </ul>
    </div>
  );
}

function LeadsSection() {
  return (
    <div className="bg-white p-4 rounded shadow">
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
