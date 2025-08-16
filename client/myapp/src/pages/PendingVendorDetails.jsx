import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { pendingVendors, rejectVendor, verifyVendor } from '../features/VendorFeatures';
import { Button, Container, Paper } from '@mui/material'

const PendingVendorDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.vendor);
  const vendorUser = list.filter(vendor => vendor._id === id);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(pendingVendors());
    }
  }, [status, dispatch]);

  const handleApprove = () => {
    dispatch(verifyVendor(id));
    alert('Vendor approved successfully!');
  };
  const handleReject = () => {
    dispatch(rejectVendor(id));
    alert('Vendor rejected successfully!');
  };

  return (
    <div className="">
      <Container maxWidth="xl">
        <div className="w-full min-h-screen flex items-center justify-center p-4">
          {vendorUser.map((vendor, index) => (
            <Paper
              key={index}
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
                    src={vendor.storeLogo}
                    alt={vendor.storeName}
                    className="w-full h-full rounded-full object-fill"
                  />
                </div>
                <h3 className="text-2xl font-bold mt-3 capitalize">{vendor.storeName}</h3>
              </div>

              {/* Vendor Details */}
              <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side */}
                <div className="flex flex-col gap-y-3 text-lg">
                  <h3 className="text-xl font-semibold capitalize">
                    Vendor Name: <span className="font-normal">{vendor.user.name}</span>
                  </h3>
                  <p className="text-xl font-semibold flex items-center gap-x-2">
                    Vendor Email:
                    <span className="font-normal normal-case">{vendor.user.email}</span>
                  </p>
                  <p><span className="font-semibold">Description:</span> {vendor.storeDescription}</p>
                  <p><span className="font-semibold">CNIC:</span> {vendor.CNIC}</p>
                  <p><span className="font-semibold">Address:</span> {vendor.address}</p>
                  <p><span className="font-semibold">City:</span> {vendor.city}</p>
                  <p><span className="font-semibold">Phone:</span> {vendor.phoneNumber}</p>
                  <p><span className="font-semibold">Account Number:</span> {vendor.accountNumber}</p>
                  <p><span className="font-semibold">Postal Code:</span> {vendor.postalCode}</p>
                  <p><span className="font-semibold">Country:</span> {vendor.country}</p>
                  {vendor.websiteURL && (
                    <p><span className="font-semibold">Website:</span> {vendor.websiteURL}</p>
                  )}
                </div>

                {/* Right Side (Images) */}
                <div className="flex flex-col gap-4">
                  <img
                    src={vendor.cnicFrontImage}
                    alt="CNIC Front"
                    className="w-full h-[250px] rounded-md object-fill"
                  />
                  <img
                    src={vendor.cnicBackImage}
                    alt="CNIC Back"
                    className="w-full h-[250px] rounded-md object-fill"
                  />
                  <img
                    src={vendor.transactionImage}
                    alt="Transaction"
                    className="w-full h-[250px] rounded-md object-fill"
                  />
                </div>
              </div>
              <div className='w-full flex items-center justify-end h-auto p-4 gap-x-3 ' >
                  <Button onClick={() => handleApprove(vendor._id) } color='success' variant='contained' >Approve</Button>
                  <Button onClick={() => handleReject(vendor._id)} color='error' variant='contained' >Reject</Button>
              </div>
            </Paper>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default PendingVendorDetails;
