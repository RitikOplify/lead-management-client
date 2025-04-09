"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncCurrentUser } from "@/store/actions/auth";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/dashboard";

function Home() {
  const data = [
    {
      id: "C11",
      name: "Pooja",
      email: "pooja@email.com",
      phone: "1234567891",
      executive: "",
      status: "Active",
      designation: "Sales",
      birthday: "Apr 08, 2000",
    },
    {
      id: "C10",
      name: "Venu",
      email: "venu@email.com",
      phone: "1234567895",
      executive: "",
      status: "Active",
      designation: "manager",
      birthday: "Apr 17, 2020",
    },
    // Add remaining data similarly...
  ];

  const statusColor = {
    Active: "bg-blue-100 text-blue-700",
    Spoke: "bg-purple-100 text-purple-700",
    Unattended: "bg-red-100 text-red-700",
    "Not interested": "bg-orange-100 text-orange-700",
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Don't redirect until auth status is checked
    if (!isLoading && user === null) {
      router.replace("/signin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null; // or null, or a spinner
  }

  return <AdminDashboard />;
}

export default Home;

{
  /* <div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Contacts</h2>
          <div className="space-x-2">
            <button className="border px-4 py-2 rounded hover:bg-gray-100">
              Filter
            </button>
            <button className="border px-4 py-2 rounded hover:bg-gray-100">
              Bulk Upload
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add New
            </button>
          </div>
        </div>

        <div className="overflow-auto border rounded shadow-sm">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2">SL No.</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Executive</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Designation</th>
                <th className="px-4 py-2">Birthday</th>
              </tr>
            </thead>
            <tbody>
              {data.map((contact, index) => (
                <tr key={contact.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{contact.id}</td>
                  <td className="px-4 py-2">{contact.name}</td>
                  <td className="px-4 py-2">{contact.email}</td>
                  <td className="px-4 py-2">{contact.phone}</td>
                  <td className="px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                      {contact.name.charAt(0)}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusColor[contact.status]
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{contact.designation}</td>
                  <td className="px-4 py-2">{contact.birthday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div> */
}
