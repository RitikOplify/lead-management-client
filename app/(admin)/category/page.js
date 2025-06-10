"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CreateCategoryForm from "@/components/popups/CreateCategory";
import CreateSubcategoryForm from "@/components/popups/CreateSubCategory";

const Page = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [subCategoryToEdit, setSubCategoryToEdit] = useState(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const { categories } = useSelector((state) => state.leads);

  const toggleSubcategories = (categoryId) => {
    setExpandedCategoryId(
      expandedCategoryId === categoryId ? null : categoryId
    );
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setCategoryOpen(true);
  };

  const handleDeleteCategory = (id) => {
    console.log("Delete Category:", id);
  };

  const handleEditSubCategory = (subCategory) => {
    setSubCategoryToEdit(subCategory);
    setSubCategoryOpen(true);
  };

  const handleDeleteSubCategory = (id) => {
    console.log("Delete SubCategory:", id);
  };

  const handleCloseCategoryForm = () => {
    setCategoryOpen(false);
    setCategoryToEdit(null);
  };

  const handleCloseSubCategoryForm = () => {
    setSubCategoryOpen(false);
    setSubCategoryToEdit(null);
  };

  return (
    <>
      {categoryOpen && (
        <CreateCategoryForm
          onClose={handleCloseCategoryForm}
          categoryToEdit={categoryToEdit}
        />
      )}

      {subCategoryOpen && (
        <CreateSubcategoryForm
          onClose={handleCloseSubCategoryForm}
          subCategoryToEdit={subCategoryToEdit}
        />
      )}
      <div className=" max-w-7xl mx-auto bg-white rounded-xl px-6 py-8 space-y-8 shadow-sm">
        {/* Header Buttons */}
        <div className="flex flex-wrap gap-4 ">
          <button
            className="bg-[#1B2430] hover:bg-[#2F3E46] text-white font-medium px-5 py-2 rounded-md transition-all shadow-sm"
            onClick={() => {
              setCategoryToEdit(null);
              setCategoryOpen(true);
            }}
          >
            + Create Category
          </button>
          <button
            className="bg-[#1B2430] hover:bg-[#2F3E46] text-white font-medium px-5 py-2 rounded-md transition-all shadow-sm"
            onClick={() => {
              setSubCategoryToEdit(null);
              setSubCategoryOpen(true);
            }}
          >
            + Create Subcategory
          </button>
        </div>

        {/* Categories List */}
        <div className="grid grid-cols-1 min-w-full sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories?.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-md transition hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-[#1B2430]">
                    {cat.name}
                  </h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                    >
                      Edit
                    </button>
                    {/* <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
                    >
                      Delete
                    </button> */}
                  </div>
                </div>

                {/* Toggle Subcategories */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleSubcategories(cat.id)}
                    className="text-sm text-[#092C1C] hover:underline font-medium"
                  >
                    {expandedCategoryId === cat.id
                      ? "Hide Subcategories"
                      : "View Subcategories"}
                  </button>
                </div>

                {/* Subcategories */}
                {expandedCategoryId === cat.id && (
                  <div className="mt-4 space-y-2">
                    {cat.subcategories?.length > 0 ? (
                      cat.subcategories.map((subCat) => (
                        <div
                          key={subCat.id}
                          className="flex justify-between items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-md"
                        >
                          <span className="text-gray-800 text-sm font-medium">
                            {subCat.name}
                          </span>
                          <div className="space-x-2">
                            <button
                              onClick={() => handleEditSubCategory(subCat)}
                              className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            >
                              Edit
                            </button>
                            {/* <button
                              onClick={() => handleDeleteSubCategory(subCat.id)}
                              className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                              Delete
                            </button> */}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No Subcategories Found
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-base">No Categories Found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
