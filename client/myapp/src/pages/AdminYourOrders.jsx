import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Paper, Button, Select, MenuItem } from "@mui/material";
import { getallOrders, updateOrderStatus, rejectOrder as rejectBuyNowOrder, getOrders } from "../features/BuyNowForMeFeatures";
import { userOrder as getProceedOrders, updateStatus, rejectOrder } from "../features/ProceedTocheckoutFeature";

const AdminYourOrders = () => {
  const dispatch = useDispatch();

  // ProceedToCheckout orders
  const { list: proceedOrders = [], loading: loadingProceed, error: errorProceed } =
    useSelector((state) => state.proceed);

  // BuyNowForMe orders
  const { order: buyNowOrdersRaw = [], loading: loadingBuyNow, error: errorBuyNow } =
    useSelector((state) => state.buyNowForMe);

  // Normalize orders data
  const normalizeOrders = (orders) => {
    if (!orders) return [];
    if (Array.isArray(orders)) return orders;
    if (orders.orders && Array.isArray(orders.orders)) return orders.orders;
    return [];
  };

  const proceedOrdersNormalized = normalizeOrders(proceedOrders);
  const buyNowOrders = normalizeOrders(buyNowOrdersRaw);

  useEffect(() => {
    dispatch(getProceedOrders());  // fetch ProceedToCheckout orders
    dispatch(getOrders());      // fetch BuyNowForMe orders
  }, [dispatch]);

  const loading = loadingProceed || loadingBuyNow;
  const error = errorProceed || errorBuyNow;

  const handleStatusChange = (orderId, status, isBuyNowOrder = false) => {
    if (!orderId || !status) return;

    const action = isBuyNowOrder ? updateOrderStatus({ orderId, status }) : updateStatus({ orderId, status });
    dispatch(action)
      .unwrap()
      .then(() => {
        // Refresh all orders after update
        dispatch(getProceedOrders());
        dispatch(getallOrders());
      })
      .catch((err) => console.error("Update failed:", err));
  };

  const handleReject = (orderId, isBuyNowOrder = false) => {
    if (!orderId) return;

    const action = isBuyNowOrder ? rejectBuyNowOrder(orderId) : rejectOrder(orderId);
    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(getProceedOrders());
        dispatch(getallOrders());
      })
      .catch((err) => console.error("Rejection failed:", err));
  };

  if (loading)
    return <div className="w-full min-h-screen flex items-center justify-center p-6">Loading orders...</div>;
  if (error)
    return <div className="w-full min-h-screen flex items-center justify-center p-6 text-red-600">Error: {String(error)}</div>;

  // Combine orders (exclude user orders)
  const allOrders = [
    ...proceedOrdersNormalized.map(order => ({ ...order, type: "proceed" })),
    ...buyNowOrders.map(order => ({ ...order, type: "buyNow" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <Container maxWidth="xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">All Customer Orders</h1>

        {allOrders.length === 0 ? (
          <Paper elevation={3} className="p-6 text-center">
            <p className="text-gray-600">No orders found.</p>
          </Paper>
        ) : (
          allOrders.map((order, idx) => {
            const isBuyNowOrder = order.type === "buyNow";
            const items = order.products || [];
            const orderDate = new Date(order.createdAt || Date.now()).toLocaleString();

            return (
              <div key={`${order.type}-${order._id || idx}`} className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">
                  {isBuyNowOrder ? "Buy Now Order" : "Proceed Order"} #{idx + 1}
                  <span className="ml-2 text-xs font-normal text-gray-500">{orderDate}</span>
                </h2>

                {items.map((item, itemIdx) => {
                  const product = item.product || item;
                  const img = product?.image?.[0]?.url || "/placeholder.png";
                  const description = product?.description || "No description available";

                  return (
                    <Paper
                      key={`${order.type}-${order._id}-${itemIdx}`}
                      elevation={3}
                      className="flex flex-col md:flex-row gap-4 p-4 mb-4 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-full md:w-32 h-32 overflow-hidden rounded-lg">
                        <img
                          src={img}
                          alt={product?.name || "Product"}
                          className="w-full h-full object-cover"
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-bold line-clamp-2">{product?.name || "Untitled Product"}</h3>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              order.orderStatus === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.orderStatus === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">Ordered by: {order.userName || order.user?.name || "Unknown"}</p>

                        {!isBuyNowOrder && (
                          <p className="text-xs text-gray-500">{order.email} | {order.phone}</p>
                        )}

                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Qty:</span> {item?.quantity || 1}
                          </div>
                          <div>
                            <span className="text-gray-500">Price:</span> ${(item?.priceAtPurchase || product?.price || 0).toFixed(2)}
                          </div>
                          <div className="text-right">
                            <span className="text-gray-500">Total:</span> ${order.price?.toFixed(2) || "0.00"}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <Select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value, isBuyNowOrder)}
                            size="small"
                            className="min-w-[150px]"
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleReject(order._id, isBuyNowOrder)}
                          >
                            Reject Order
                          </Button>
                        </div>
                      </div>
                    </Paper>
                  );
                })}
              </div>
            );
          })
        )}
      </Container>
    </div>
  );
};

export default AdminYourOrders;
