import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Container, Paper } from '@mui/material'
import { allBlockedVendors, unBlockVendor, deleteVendor } from '../features/VendorFeatures';

const BlockedVendors = () => {
  const dispatch = useDispatch();
  const blockedVendors = useSelector((state) => state.vendor.list || []);
  const { status, error } = useSelector((state) => state.vendor);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(allBlockedVendors());
    }
  }, [status, dispatch]);

  const handleUnblock = (id) => {
    dispatch(unBlockVendor(id))
      .unwrap()
      .then(() => {
        dispatch(allBlockedVendors());
        alert('Vendor unblocked successfully!');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleDelete = (id) => {
    dispatch(deleteVendor(id))
      .unwrap()
      .then(() => {
        dispatch(allBlockedVendors());
        alert('Vendor deleted successfully!');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-5">
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '1rem',
          marginBottom: '1rem',
        }}
      >
        {status === 'loading' && (
          <p className="text-center text-lg font-medium">Loading...</p>
        )}
        {status === 'failed' && <p className="text-red-500">{error}</p>}

        {blockedVendors.map((vendor) => (
          <Paper
            key={vendor._id}
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'row', // ✅ always row
              alignItems: 'center',
              padding: '1rem',
              marginBottom: '1rem',
              justifyContent: 'space-between',
              width: '100%',
              minHeight: '160px',
              gap: 2,
            }}
          >
            {/* Image Section */}
            <div className="w-[30%] h-[120px] md:h-[160px] flex items-center justify-center">
              <img
                src={vendor.storeLogo}
                alt={vendor.storeName}
                className="w-full h-full object-contain rounded-md"
              />
            </div>

            {/* Text Section */}
            <div className="w-[40%] flex flex-col items-start gap-y-2 text-left px-2">
              <h3 className="text-lg md:text-2xl font-semibold capitalize">
                {vendor.storeName}
              </h3>
              <h4 className="text-sm md:text-lg">
                Store Owner : {vendor.user.name}
              </h4>
            </div>

            {/* Action Buttons */}
            <div className="w-[30%] flex items-center justify-end gap-3">
              <Button
                onClick={() => handleUnblock(vendor._id)}
                variant="contained"
                color="success"
                size="small"
              >
                Unblock
              </Button>
              <Button
                onClick={() => handleDelete(vendor._id)}
                variant="contained"
                color="error"
                size="small"
              >
                Delete
              </Button>
            </div>
          </Paper>
        ))}
      </Container>
    </div>
  );
};

export default BlockedVendors;
