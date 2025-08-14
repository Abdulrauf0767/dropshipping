import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "../features/WishlistFeature";
import Header from "../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { loading, error, items } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {loading && <p>Loading wishlist...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((product,index) => (
              <div
                key={index}
                className="w-full h-[180px] bg-white rounded-lg shadow-md flex items-center p-4"
              >
                {/* Image */}
                <div className="w-[150px] h-full flex-shrink-0">
                  <img
                    src={
                      product.image?.length > 0
                        ? product.image[0].url
                        : "/placeholder.jpg"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between h-full flex-1 pl-6">
                  <div>
                    <h2 className="text-lg font-semibold line-clamp-2">
                      {product.name}
                    </h2>
                    <p className="text-lg font-bold text-orange-600 mt-2">
                      RS: {product.price}
                    </p>
                  </div>
                </div>

                {/* Delete Button on Right */}
                <button
                  onClick={() => handleRemove(product._id)}
                  className="ml-auto text-red-500 hover:text-red-700 transition"
                >
                  <DeleteIcon fontSize="large" />
                </button>
              </div>
            ))
          ) : (
            <p>No products in wishlist.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
