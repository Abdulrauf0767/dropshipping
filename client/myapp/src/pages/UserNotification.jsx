// src/components/UserNotification.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import {
  getNotification,
  markNotificationAsRead,
} from "../features/NotificationFeature";

const UserNotification = () => {
  const Server_Url = "http://localhost:5001";
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(getNotification());

    const socket = io(Server_Url, { withCredentials: true });

    socket.on("new-notification", () => {
      dispatch(getNotification());
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="font-bold text-2xl mb-5">🔔 Notifications</h2>

      {loading && <p>Loading...</p>}
      {notifications.length === 0 && !loading && (
        <p className="text-gray-500">No notifications found.</p>
      )}

      <ul className="space-y-4">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`p-5 w-full rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
              n.isRead
                ? "bg-gray-50 border-gray-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {n.notificationType === "order" && n.link ? (
                  <Link to={n.link} onClick={(e) => e.stopPropagation()}>
                    <p className="text-gray-800">
                      <span className="font-semibold text-blue-600">
                        {n.product?.name || "Product"}
                      </span>
                      <span className="text-gray-700">
                        {" "}
                        — {n.message.replace(/Your order for.*? has/, "has")}
                      </span>
                    </p>
                  </Link>
                ) : (
                  <p className="text-gray-700 font-medium">{n.message}</p>
                )}
              </div>

              {!n.isRead && (
                <span className="ml-2 text-xs font-semibold bg-red-500 text-white rounded-full px-2 py-0.5">
                  New
                </span>
              )}
            </div>

            <div className="mt-3 flex gap-3">
              {!n.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(n._id)}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserNotification;
