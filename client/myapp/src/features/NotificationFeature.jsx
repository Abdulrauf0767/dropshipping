import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:5001/api/notification';

// ✅ Get all notifications
export const getNotification = createAsyncThunk(
  'notification/getNotification',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseUrl}/all`, {
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_API_KEY,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });
      return res.data.notification; // directly returning array
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      );
    }
  }
);

// ✅ Mark a single notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${baseUrl}/mark-as-read/${notificationId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      );
      return res.data.notification; // returning single updated notification
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      );
    }
  }
);

const NotificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Get all notifications
      .addCase(getNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Mark as read
      .addCase(markNotificationAsRead.pending, (state) => {
        state.error = null;
        // ⚠️ Loading ko optional rakho taki UI na flash kare
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updatedNotification = action.payload; // single notification
        state.notifications = state.notifications.map((n) =>
          n._id === updatedNotification._id
            ? { ...n, isRead: true }
            : n
        );
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default NotificationSlice.reducer;
