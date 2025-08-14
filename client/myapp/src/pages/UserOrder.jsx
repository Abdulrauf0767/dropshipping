import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../features/BuyNowForMeFeatures";

const UserOrder = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const allOrders = useSelector((state) => state.buyNowForMe.order);
  console.log("All Orders:", allOrders);

  return (
    <div className="flex justify-center items-center w-full flex-col">
      <h1 className="text-2xl font-bold font-lisuBusa mt-10 text-center">
        Your Orders
      </h1>

      <div className="w-[95%] mx-auto mt-5 flex flex-col gap-y-4">
        {allOrders.map((order) => {
          const product = order.products[0]; // assuming single product per order
          return (
            <div
              key={order._id}
              className="w-full h-[130px] bg-gray-200 rounded-3xl flex items-center p-4 shadow-sm"
            >
              {/* Left side: product image */}
              <div className="w-[130px] h-full flex-shrink-0 flex items-center justify-center">
                <img
                  src={product?.image?.[0]?.url || "/placeholder.png"}
                  alt={product?.name || "Product"}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Right side: product info */}
              <div className="flex-1 pl-4 flex flex-col justify-center">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {product?.name || "Product Name"}
                </h2>
                <div className="mt-3">
                  <span className="font-medium text-black">Delivery Status:</span>{" "}
                  <span
                    className="inline-block bg-green-500 text-white px-4 py-1 rounded-3xl text-sm font-semibold"
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserOrder;
