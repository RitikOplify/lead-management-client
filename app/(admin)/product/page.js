"use client";

import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import CreateProductForm from "@/components/popups/CreateProduct";

/** Tail-wind palette (change once – every instance updates) */
const COLORS = {
  primary: "#1B2430", // deep blue-grey
  primaryHover: "#12202C",
  positive: "blue-500",
  positiveHover: "blue-600",
  negative: "red-600",
  negativeHover: "red-700",
};

const ProductsPage = () => {
  const { products } = useSelector((state) => state.leads);
  const [isProductOpen, setProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const handleEdit = (product) => {
    setEditProduct(product);
    setProductOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // dispatch asyncDeleteProduct(id)  -- or call your API
      console.log("Deleting product with ID:", id);
    }
  };

  return (
    <section className="max-w-7xl mx-auto  bg-white rounded-xl shadow-sm overflow-hidden">
      {/* CREATE button */}
      <div className=" p-4">
        <button
          onClick={() => {
            setEditProduct(null);
            setProductOpen(true);
          }}
          className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg text-white shadow 
                    bg-[${COLORS.primary}] hover:bg-[${COLORS.primaryHover}] transition`}
        >
          <FaPlus className="text-sm" />
          Create Product
        </button>
      </div>

      {/* TABLE */}
      {products?.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Category", "Sub-category", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 whitespace-nowrap py-3 text-left text-sm font-semibold text-gray-600"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {p.category?.name || "NA"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {p.subcategory?.name || "NA"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded text-white text-xs 
                                  bg-${COLORS.positive} hover:bg-${COLORS.positiveHover} transition`}
                    >
                      <FaEdit />
                      Edit
                    </button>
                    {/* <button
                      onClick={() => handleDelete(p.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded text-white text-xs 
                                  bg-${COLORS.negative} hover:bg-${COLORS.negativeHover} transition`}
                    >
                      <FaTrash />
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-base text-gray-500 pb-6 pl-6">No products found.</p>
      )}

      {/* MODAL */}
      {isProductOpen && (
        <CreateProductForm
          onClose={() => {
            setProductOpen(false);
            setEditProduct(null);
          }}
          defaultValues={{
            name: editProduct?.name ?? "",
            categoryId: editProduct?.categoryId ?? "",
            subcategoryId: editProduct?.subcategoryId ?? "",
          }}
          productId={editProduct?.id ?? null}
        />
      )}
    </section>
  );
};

export default ProductsPage;
