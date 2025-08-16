import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { pendingVendors, rejectVendor, verifyVendor } from '../features/VendorFeatures';
import { Button, Container, Paper } from '@mui/material'

const PendingVendorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list = [], status, error } = useSelector(state => state.vendor);

  // agar list array nahi hai to empty array bana do
  const vendorList = Array.isArray(list) ? list : [];
  const vendorUser = vendorList.find(vendor => vendor._id === id);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(pendingVendors());
    }
  }, [status, dispatch]);

  const handleApprove = (vendorId) => {
    dispatch(verifyVendor(vendorId))
      .unwrap()
      .then(() => {
        alert('Vendor approved successfully!');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleReject = (vendorId) => {
    dispatch(rejectVendor(vendorId))
      .unwrap()
      .then(() => {
        alert('Vendor rejected successfully!');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!vendorUser) {
    return (
      <Container maxWidth="xl">
        <div className="w-full min-h-screen flex items-center justify-center">
          <p className="text-xl font-semibold text-gray-600">
            Vendor not found or still loading...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <div className="">
      <Container maxWidth="xl">
        <div className="w-full min-h-screen flex items-center justify-center p-4">
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              maxWidth: '1000px',
              height: 'auto',
              padding: '16px',
            }}
          >
            {/* Store Logo + Name */}
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-[180px] h-[180px] rounded-full border-2 border-gray-400 overflow-hidden">
                <img
                  src={vendorUser.storeLogo}
                  alt={vendorUser.storeName}
                  className="w-full h-full rounded-full object-fill"
                />
              </div>
              <h3 className="text-2xl font-bold mt-3 capitalize">{vendorUser.storeName}</h3>
            </div>

            {/* Vendor Details */}
            <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side */}
              <div className="flex flex-col gap-y-3 text-lg">
                <h3 className="text-xl font-semibold capitalize">
                  Vendor Name: <span className="font-normal">{vendorUser.user?.name}</span>
                </h3>
                <p className="text-xl font-semibold flex items-center gap-x-2">
                  Vendor Email:
                  <span className="font-normal normal-case">{vendorUser.user?.email}</span>
                </p>
                <p><span className="font-semibold">Description:</span> {vendorUser.storeDescription}</p>
                <p><span className="font-semibold">CNIC:</span> {vendorUser.CNIC}</p>
                <p><span className="font-semibold">Address:</span> {vendorUser.address}</p>
                <p><span className="font-semibold">City:</span> {vendorUser.city}</p>
                <p><span className="font-semibold">Phone:</span> {vendorUser.phoneNumber}</p>
                <p><span className="font-semibold">Account Number:</span> {vendorUser.accountNumber}</p>
                <p><span className="font-semibold">Postal Code:</span> {vendorUser.postalCode}</p>
                <p><span className="font-semibold">Country:</span> {vendorUser.country}</p>
                {vendorUser.websiteURL && (
                  <p><span className="font-semibold">Website:</span> {vendorUser.websiteURL}</p>
                )}
              </div>

              {/* Right Side (Images) */}
              <div className="flex flex-col gap-4">
                <img
                  src={vendorUser.cnicFrontImage}
                  alt="CNIC Front"
                  className="w-full h-[250px] rounded-md object-fill"
                />
                <img
                  src={vendorUser.cnicBackImage}
                  alt="CNIC Back"
                  className="w-full h-[250px] rounded-md object-fill"
                />
                <img
                  src={vendorUser.transactionImage}
                  alt="Transaction"
                  className="w-full h-[250px] rounded-md object-fill"
                />
              </div>
            </div>

            {/* Approve / Reject Buttons */}
            <div className='w-full flex items-center justify-end h-auto p-4 gap-x-3 ' >
              <Button onClick={() => handleApprove(vendorUser._id)} color='success' variant='contained'>Approve</Button>
              <Button onClick={() => handleReject(vendorUser._id)} color='error' variant='contained'>Reject</Button>
            </div>
          </Paper>
        </div>
      </Container>
    </div>
  );
};

export default PendingVendorDetails;
