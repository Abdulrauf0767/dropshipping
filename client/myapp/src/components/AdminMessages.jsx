import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, getMessages } from "../features/ContactFeatures";
import { motion } from "framer-motion";
import { MailOutline, Person, Subject, Delete } from "@mui/icons-material";

const AdminMessages = () => {
  const dispatch = useDispatch();
  const { contact, loading } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(getMessages());
  }, [dispatch]);

  const messages = contact?.messages || [];

  const hadleDelete = (id) => {
    dispatch(deleteMessage(id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-indigo-800">
          📩 User Messages
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-indigo-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-indigo-200 rounded w-40"></div>
              <div className="h-4 bg-indigo-200 rounded w-32 mt-2"></div>
            </div>
          </div>
        ) : messages.length > 0 ? (
          <div className="grid gap-6">
            {messages.map((msg, index) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Header: Name + Email */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                      <div className="p-2 bg-white bg-opacity-20 rounded-full">
                        <Person className="text-white" fontSize="small" />
                      </div>
                      <p className="font-semibold text-lg">{msg.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MailOutline className="text-white" fontSize="small" />
                      <p className="text-white text-sm bg-black bg-opacity-20 px-2 py-1 rounded-full">
                        {msg.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Subject */}
                  <div className="flex items-center gap-2 mb-4 p-3 bg-indigo-50 rounded-lg">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <Subject className="text-indigo-600" fontSize="small" />
                    </div>
                    <p className="text-indigo-800 font-medium">{msg.subject}</p>
                  </div>

                  {/* Message Body */}
                  <div className="bg-indigo-50 p-5 rounded-xl mb-4">
                    <p className="text-gray-700 text-base leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end">
                    <button
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
                      onClick={() => hadleDelete(msg._id)}
                    >
                      <Delete fontSize="small" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                
                {/* Timestamp (optional) */}
                <div className="px-6 pb-4">
                  <p className="text-xs text-gray-500 text-right">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <MailOutline className="text-red-500" fontSize="large" />
              </div>
            </div>
            <p className="text-xl text-gray-700 mb-2">No messages found</p>
            <p className="text-gray-500">All user messages will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;