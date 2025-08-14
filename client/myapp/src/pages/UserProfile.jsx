import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateProfile } from "../features/UserFeature";
import { toast } from "react-toastify";
import { IconButton, Avatar, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: "",
    address: "",
    gender: "",
    age: "",
  });
  const [editableField, setEditableField] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const fileInputRef = useRef(null);

  // Fetch profile on mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Fill formData from API response
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        address: profile.address || "",
        gender: profile.gender || "",
        age: profile.age || "",
      });
      setAvatarPreview(profile.avatar || "");
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      handleSubmit("avatar", file);
    }
  };

  const handleSubmit = async (fieldName, fileValue = null) => {
    try {
      if (!profile?._id) return toast.error("User ID not found");

      const payload = new FormData();
      payload.append("id", profile._id);

      if (fieldName === "avatar" && fileValue) {
        payload.append("avatar", fileValue);
      } else if (fieldName === "password") {
        if (!password) return toast.error("Please enter a password");
        payload.append("password", password);
      } else {
        payload.append(fieldName, formData[fieldName]);
      }

      const res = await dispatch(updateProfile(payload)).unwrap();
      toast.success(res.message || "Profile updated successfully");

      dispatch(getUserProfile());
      setEditableField(null);
      if (fieldName === "password") setPassword("");
    } catch (err) {
      toast.error(err?.message || "Update failed");
    }
  };

  const allFields = [
    { key: "name", label: "Name" },
    { key: "bio", label: "Bio" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "gender", label: "Gender" },
    { key: "age", label: "Age" },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative">
      {/* Settings Button */}
      <div className="absolute top-4 right-4">
        <Tooltip title="Account Settings">
          <IconButton onClick={() => setSettingsOpen(!settingsOpen)}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="cursor-pointer" onClick={() => fileInputRef.current.click()}>
          {avatarPreview ? (
            <Avatar src={avatarPreview} sx={{ width: 100, height: 100 }} />
          ) : (
            <Avatar sx={{ width: 100, height: 100 }}>
              <AccountCircleIcon sx={{ fontSize: 100 }} />
            </Avatar>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: "none" }}
        />
        <h2 className="text-xl font-semibold mt-3">{profile?.name || "User"}</h2>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {allFields.map((field) => (
          <div key={field.key} className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">{field.label}</label>
              <input
                type={field.key === "age" ? "number" : "text"}
                name={field.key}
                value={formData[field.key]}
                disabled={editableField !== field.key}
                onChange={handleChange}
                placeholder={`Enter ${field.label}`}
                className={`mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  editableField === field.key ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
            <IconButton
              onClick={() =>
                editableField === field.key
                  ? handleSubmit(field.key)
                  : setEditableField(field.key)
              }
            >
              {editableField === field.key ? <SaveIcon color="success" /> : <EditIcon />}
            </IconButton>
          </div>
        ))}

        {/* Settings: Email & Password */}
        {settingsOpen && (
          <>
            <div className="bg-gray-50 p-3 rounded-xl shadow-sm">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="mt-1 w-full border rounded-lg p-2 bg-gray-100"
              />
            </div>
            <div className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-500">New Password</label>
                <input
                  type="password"
                  value={password}
                  disabled={editableField !== "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={`mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editableField === "password" ? "bg-white" : "bg-gray-100"
                  }`}
                />
              </div>
              <IconButton
                onClick={() =>
                  editableField === "password"
                    ? handleSubmit("password")
                    : setEditableField("password")
                }
              >
                {editableField === "password" ? <SaveIcon color="success" /> : <EditIcon />}
              </IconButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
