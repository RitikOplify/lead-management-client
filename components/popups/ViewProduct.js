import { IoClose } from "react-icons/io5";

const ViewProduct = ({ onClose, lead }) => {
  console.log(lead);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white h-screen sm:h-auto md:rounded-xl shadow-xl w-full max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <IoClose size={24} />
        </button>
        <div className=" max-w-lg">
          <h3 className="text-lg font-medium mb-4 ">Product Info</h3>
          <p>
            <span className="font-medium">Price:</span> ₹
            {lead.price?.toLocaleString()}
          </p>

          <table className="w-full divide-y divide-gray-200 mt-6 shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Product Name
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Sub Cubcategory
                </th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              {lead.products?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-700">{product.name}</td>
                  <td className="p-4 text-sm text-gray-700">
                    {product.category?.name}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {product.subcategory?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
