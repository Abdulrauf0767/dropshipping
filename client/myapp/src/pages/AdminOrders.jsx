import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Paper } from "@mui/material";
import { allOrders } from "../features/ProceedTocheckoutFeature";
import { getallOrders } from "../features/BuyNowForMeFeatures";

const AdminOrders = () => {
  const dispatch = useDispatch();

  // ProceedToCheckout orders
  const { list: proceedOrders = [], loading: loadingProceed, error: errorProceed } =
    useSelector((state) => state.proceed);

  // BuyNowForMe orders
  const { order: buyNowOrdersRaw = [], loading: loadingBuyNow, error: errorBuyNow } =
    useSelector((state) => state.buyNowForMe);

  // Ensure buyNowOrders is always an array
  const buyNowOrders = Array.isArray(buyNowOrdersRaw)
    ? buyNowOrdersRaw
    : buyNowOrdersRaw?.orders
    ? buyNowOrdersRaw.orders
    : [];

  useEffect(() => {
    dispatch(allOrders());
    dispatch(getallOrders());
  }, [dispatch]);

  const loading = loadingProceed || loadingBuyNow;
  const error = errorProceed || errorBuyNow;

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <span className="text-gray-600">Loading orders…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <span className="text-red-600">Error: {String(error)}</span>
      </div>
    );
  }

  // Render orders
  const renderOrders = (orders, type) => {
    if (!Array.isArray(orders) || orders.length === 0) return null;

    return orders.map((order, idx) => (
      <div key={`${type}-${order._id}`} className="flex flex-col gap-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800">
          {type === "proceed" ? "Proceed Order" : "Buy Now Order"} #{idx + 1}
          <span className="ml-2 text-xs font-normal text-gray-500">
            {new Date(order.createdAt || Date.now()).toLocaleString()}
          </span>
        </h2>
        
        {(order.products || []).map((item, i) => {
          const p = item.product || item;
          const img = p?.image?.[0]?.url || "/placeholder.png";

          return (
            <Paper
              key={`${type}-${order._id}-${i}`}
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { sm: "center" },
                gap: 2,
                p: 2,
                width: "100%",
                borderRadius: 2,
                boxSizing: "border-box",
                mb: 2,
              }}
            >
              {/* Number badge */}
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold bg-gray-200">
                {i + 1}
              </div>

              {/* Product Image */}
              <div
                className="flex-shrink-0 rounded-lg overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "120px",
                  height: "100px",
                }}
              >
                <img 
                  src={img} 
                  alt={p?.name || "Product"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold line-clamp-2" style={{ wordBreak: "break-word" }}>
                    {p?.name || "Untitled product"}
                  </h3>
                  <span 
                    className="text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-full bg-green-500 text-white shadow-sm"
                    style={{ alignSelf: "flex-start" }}
                  >
                    {order?.orderStatus || "pending"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {p?.description || "-"}
                </p>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500">Qty: </span>
                    <span className="font-medium">{item?.quantity ?? 1}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Price: </span>
                    <span className="font-medium">{p?.price ?? item?.price ?? "-"}</span>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-gray-500">Total: </span>
                    <span className="font-semibold">
                      {order?.total ? `$${order.total.toFixed(2)}` : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </Paper>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <Container maxWidth="xl" sx={{ padding: { xs: 0, sm: 2 } }}>
        {/* Proceed To Checkout Orders */}
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-4 text-gray-800">Proceed To Checkout Orders</h1>
          {proceedOrders.length === 0 ? (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <span className="text-gray-600">No Proceed To Checkout orders found.</span>
            </div>
          ) : (
            renderOrders(proceedOrders, "proceed")
          )}
        </div>

        {/* Buy Now Orders */}
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-4 text-gray-800">Buy Now Orders</h1>
          {buyNowOrders.length === 0 ? (
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <span className="text-gray-600">No Buy Now orders found.</span>
            </div>
          ) : (
            renderOrders(buyNowOrders, "buyNow")
          )}
        </div>
      </Container>
    </div>
  );
};

export default AdminOrders;