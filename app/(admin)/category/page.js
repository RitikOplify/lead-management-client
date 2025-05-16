"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Nav from "@/components/Nav";
import { useSelector } from "react-redux";
import CreateCategoryForm from "@/components/popups/CreateCategory";
import CreateSubcategoryForm from "@/components/popups/CreateSubCategory";

const Page = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [subCategoryToEdit, setSubCategoryToEdit] = useState(null);
  const [navOpen, setNavOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const { categories } = useSelector((state) => state.leads);

  const toggleSubcategories = (categoryId) => {
    setExpandedCategoryId(expandedCategoryId === categoryId ? null : categoryId);
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setCategoryOpen(true);
  };

  const handleDeleteCategory = (id) => {
    console.log("Delete Category:", id);
    // TODO: confirm and call delete API
  };

  const handleEditSubCategory = (subCategory) => {
    setSubCategoryToEdit(subCategory);
    setSubCategoryOpen(true);
  };

  const handleDeleteSubCategory = (id) => {
    console.log("Delete SubCategory:", id);
    // TODO: confirm and call delete API
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
    <div className="flex h-screen">
      <Nav navOpen={navOpen} setNavOpen={setNavOpen} />

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
            className="bg-[#092C1C] text-white px-6 py-2 rounded"
            onClick={() => {
              setCategoryToEdit(null);
              setCategoryOpen(true);
            }}
          >
            Create Category
          </button>
          <button
            className="bg-[#092C1C] text-white px-6 py-2 rounded"
            onClick={() => {
              setSubCategoryToEdit(null);
              setSubCategoryOpen(true);
            }}
          >
            Create Sub Category
          </button>
        </div>

        <div className="rounded-lg p-4">
          {categories?.length > 0 ? (
            <div className="space-y-4 mt-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="border rounded-lg p-4 shadow-sm bg-white"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{cat.name}</h2>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditCategory(cat)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => toggleSubcategories(cat.id)}
                        className="px-3 py-1 bg-gray-200 rounded text-sm cursor-pointer"
                      >
                        {expandedCategoryId === cat.id
                          ? "Hide Subcategories"
                          : "View Subcategories"}
                      </button>
                    </div>
                  </div>

                  {expandedCategoryId === cat.id && (
                    <div className="mt-4 space-y-2">
                      {cat.subcategories?.length > 0 ? (
                        cat.subcategories.map((subCat) => (
                          <div
                            key={subCat.id}
                            className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
                          >
                            <span>{subCat.name}</span>
                            <div className="space-x-2">
                              <button
                                onClick={() => handleEditSubCategory(subCat)}
                                className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSubCategory(subCat.id)}
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No Subcategories Found</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No Category Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
