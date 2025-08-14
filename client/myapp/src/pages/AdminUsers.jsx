import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allUsers, blockUser, unBlockUser, searchUsers } from "../features/UserFeature";
import { Block, LockOpen, Search } from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";
import debounce from "lodash.debounce";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { alluser = [], status, error } = useSelector((state) => state.user); // ✅ Default to empty array
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  // Fetch all users
  const fetchUsers = () => dispatch(allUsers());

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim().length > 0) {
        dispatch(searchUsers(query.trim()));
      } else {
        fetchUsers();
      }
    }, 500),
    [dispatch]
  );

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        setLoadingAction(true);
        await dispatch(blockUser(userId));
        await fetchUsers();
      } finally {
        setLoadingAction(false);
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      try {
        setLoadingAction(true);
        await dispatch(unBlockUser(userId));
        await fetchUsers();
      } finally {
        setLoadingAction(false);
      }
    }
  };

  if (status === "loading" || loadingAction)
    return <p className="p-4">Loading users...</p>;
  if (status === "failed") return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <TextField
          variant="outlined"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="text-gray-400" />
              </InputAdornment>
            ),
          }}
          className="w-full md:w-64 bg-white rounded-lg shadow-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alluser.length > 0 ? (
              alluser.map((user) => (
                <tr key={user?._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {user?.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user?.isBlocked ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user?.isBlocked ? (
                      <button
                        onClick={() => handleUnblockUser(user?._id)}
                        className="text-green-600 hover:text-green-900 mr-4 flex items-center"
                        title="Unblock User"
                      >
                        <LockOpen className="mr-1" /> Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockUser(user?._id)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                        title="Block User"
                      >
                        <Block className="mr-1" /> Block
                      </button>
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
    </div>
  );
};

export default AdminUsers;
