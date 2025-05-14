"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import CreateProductForm from "@/components/popups/CreateProduct";
import Nav from "@/components/Nav";
import { useSelector } from "react-redux";

const Page = () => {
  const [isProductOpen, setProductOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // for edit
  const { products } = useSelector((state) => state.leads);

  const handleEdit = (product) => {
    setEditProduct(product);
    setProductOpen(true);
  };

  const handleDelete = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // Call delete API or dispatch Redux action here
      console.log("Deleting product with ID:", productId);
    }
  };

  return (
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />

      {isProductOpen && (
        <CreateProductForm
          onClose={() => {
            setProductOpen(false);
            setEditProduct(null); // reset after closing
          }}
          productToEdit={editProduct} // pass to form
        />
      )}

      <div className="p-6 w-full lg:w-[calc(100%-256px)] space-y-6 overflow-y-auto">
        <div className="md:hidden mb-4">
          <div
            onClick={() => setNavOpen(true)}
            className="text-2xl text-[#092C1C] cursor-pointer"
          >
            <FaBars />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            className="bg-[#092C1C] text-white px-6 py-2 rounded cursor-pointer"
            onClick={() => {
              setEditProduct(null); // ensure it's not in edit mode
              setProductOpen(true);
            }}
          >
            Create Product
          </button>
        </div>

        <div className=" space-y-4">
          {products?.length > 0 ? (
            <table className="w-full divide-y divide-gray-200 mt-6 shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Sub Category
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-700">
                      {product.name}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {product.category?.name}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {product.subcategory?.name}
                    </td>
                    <td className="p-4 text-sm text-gray-700 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Product Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
