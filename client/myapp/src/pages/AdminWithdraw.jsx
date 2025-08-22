import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { Create, Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  pendingWithdraw,
  approveWithdraw,
  rejectWithdraw,
} from "../features/WithdrawFeatures";

const AdminWithdraw = () => {
  const dispatch = useDispatch();
  const { list: withdraws, status, error } = useSelector(
    (state) => state.withdraw
  );

  useEffect(() => {
    dispatch(pendingWithdraw());
  }, [dispatch]);

  const handleApprove = async (userId) => {
    await dispatch(approveWithdraw(userId)); // ✅ user._id bhejna hai
    dispatch(pendingWithdraw());
  };

  const handleReject = async (userId) => {
    await dispatch(rejectWithdraw(userId)); // ✅ user._id bhejna hai
    dispatch(pendingWithdraw());
  };

  return (
    <Container maxWidth="xl" className="py-6">
      <Typography variant="h4" className="font-bold mb-4 text-center">
        Withdraw Requests
      </Typography>

      <Paper className="shadow-lg rounded-2xl overflow-hidden">
        {status === "loading" && (
          <Alert severity="info" className="m-4">
            Loading withdraw requests...
          </Alert>
        )}

        {status === "failed" && error && (
          <Alert severity="error" className="m-4">
            {error || "Failed to load withdraw requests"}
          </Alert>
        )}

        {withdraws.length === 0 && status === "succeeded" && (
          <Alert severity="warning" className="m-4">
            No pending withdraw requests found
          </Alert>
        )}

        {withdraws.length > 0 && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead className="bg-gray-100">
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Previous Balance</TableCell>
                  <TableCell>Bank Number</TableCell>
                  <TableCell>Bank Name</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {withdraws.map((withdraw) => (
                  <TableRow key={withdraw._id} hover>
                    <TableCell>{withdraw.user?.name || "N/A"}</TableCell>
                    <TableCell>{withdraw.user?.email || "N/A"}</TableCell>
                    <TableCell className="font-bold text-blue-600">
                      {withdraw.previousBalance ?? 0}
                    </TableCell>
                    <TableCell>{withdraw.bankNumber}</TableCell>
                    <TableCell>{withdraw.bankName}</TableCell>
                    <TableCell>{withdraw.bankType}</TableCell>
                    <TableCell className="font-bold">
                      {withdraw.amount}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          withdraw.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : withdraw.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {withdraw.status}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex justify-center gap-2">
                        <IconButton
                          color="primary"
                          onClick={() => handleApprove(withdraw.user?._id)} // ✅ FIXED
                          disabled={withdraw.status !== "pending"}
                        >
                          <Create />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleReject(withdraw.user?._id)} // ✅ FIXED
                          disabled={withdraw.status !== "pending"}
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default AdminWithdraw;
