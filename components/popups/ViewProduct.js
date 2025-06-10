import { IoClose } from "react-icons/io5";

const ViewProduct = ({ onClose, lead }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative transition-transform transform hover:scale-[1.02]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          aria-label="Close"
        >
          <IoClose size={24} />
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-gray-900 ">
          Product Info
        </h3>

        <p className="text-lg mb-6 text-gray-700 ">
          <span className="font-semibold">Price:</span>{" "}
          {lead.price?.toLocaleString() || "NA"}
        </p>

        <div className=" grid grid-cols-1 sm:grid-cols-2">
          {lead.products?.map((product,i) => (
            <td key={i} className="px-6 py-4 text-gray-800  text-sm font-medium">
              {product.name}
            </td>
          ))}
        </div>

        {lead.categories?.length > 0 && (
          <div>
            <h3 className=" mb-2">Categories</h3>
            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lead.categories?.map((cat) => (
                <p
                  key={cat.id}
                  className="px-6 py-4 text-gray-800 bg-gray-50  text-sm font-medium"
                >
                  {cat.name}
                </p>
              ))}
            </div>
          </div>
        )}
        {lead.subcategories?.length > 0 && (
          <div>
            <h3 className=" mb-2">Categories</h3>
            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lead.subcategories?.map((cat) => (
                <p
                  key={cat.id}
                  className="px-6 py-4 text-gray-800 bg-gray-50  text-sm font-medium"
                >
                  {cat.name}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;
