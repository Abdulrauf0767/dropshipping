import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allUsers } from "../features/UserFeature";
import { Block, LockOpen, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { alluser, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (status === "succeeded") {
      dispatch(allUsers());
    }
  }, [dispatch]);

  if (status === "loading") return <p className="p-4">Loading users...</p>;
  if (status === "failed") return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full p-4 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>
      <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {alluser && alluser.length > 0 ? (
            alluser.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isBlocked ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Blocked
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                  {/* Block / Unblock Buttons */}
                  {user.isBlocked ? (
                    <IconButton
                      className="text-green-600"
                      title="Unblock User"
                    >
                      <LockOpen />
                    </IconButton>
                  ) : (
                    <IconButton className="text-red-600" title="Block User">
                      <Block />
                    </IconButton>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
