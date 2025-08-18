import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCart,
  removeProductFromCart,
  updateProductQuantity,
} from "../features/CartFeatures";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, status, error } = useSelector((state) => state.cart); // ✅ ab cart use ho raha hai
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const calculateTotal = () =>
    cart?.products?.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8 w-[90%]">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>

        {status === "loading" && <p className="text-center">Loading cart...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!cart?.products?.length && status !== "loading" ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500">Start shopping to add items to your cart</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {cart?.products?.map((item) => {
                  const product = item.product || {};
                  const imageUrl =
                    product.image && product.image.length > 0
                      ? product.image[0].url
                      : "/placeholder.jpg";

                  return (
                    <div
                      key={item._id}
                      className="p-4 border-b border-gray-200 last:border-b-0 flex flex-col sm:flex-row"
                    >
                      {/* Image */}
                      <div className="sm:w-1/4 flex justify-center items-center mb-4 sm:mb-0">
                        <img
                          src={imageUrl}
                          alt={product.name || "Product Image"}
                          className="w-28 h-28 object-contain rounded"
                        />
                      </div>

                      {/* Content */}
                      <div className="sm:w-3/4 sm:pl-4 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold max-w-[70%]">
                            {product.name || "Unnamed Product"}
                          </h3>
                          <button
                            onClick={() =>
                              dispatch(removeProductFromCart(product._id))
                            }
                            className="text-red-500 hover:text-red-700"
                            aria-label={`Remove ${product.name || "product"} from cart`}
                          >
                            🗑
                          </button>
                        </div>

                        <p className="text-blue-600 font-bold mb-2">
                          Rs. {product.price || 0}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              dispatch(
                                updateProductQuantity({
                                  productId: product._id,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                            className="bg-gray-200 px-3 py-1 rounded-l hover:bg-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="bg-gray-100 px-4 py-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateProductQuantity({
                                  productId: product._id,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                            className="bg-gray-200 px-3 py-1 rounded-r hover:bg-gray-300"
                          >
                            +
                          </button>
                          <span className="ml-auto font-semibold text-green-600">
                            Rs. {(product.price || 0) * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {calculateTotal()}</span>
                </div>
                <button
                  onClick={() => navigate(`/home/choose-order/${cart._id}?type=proceed`)} // ✅ cartId pass
                  className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
