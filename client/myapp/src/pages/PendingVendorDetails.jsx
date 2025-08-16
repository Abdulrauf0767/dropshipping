import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { pendingVendors } from '../features/VendorFeatures';
import {Container, Paper} from '@mui/material'
const PendingVendorDetails = () => {
  const {id} = useParams();
  const dispatch = useDispatch();
  const {list,status,error} = useSelector(state => state.vendor  )
  const vendorUser = list.filter(vendor => vendor._id === id)
  useEffect(() => {
    if (status === 'idle') {
      dispatch(pendingVendors())
    }
  })
  return (
    <>
    <div>
      <Container maxWidth="xl" >
      <Paper elevation={3} sx={{
        maxWidth : '700px',
        height : 'auto'
      }}  >
        <div className='w-full h-[200px] flex items-center justify-center ' >
          <span className='w-[180px] h-[180px] border-2 border-black rounded-full  ' >

          </span>
        </div>

      </Paper>
      </Container>
    </div>
    </>
  )
}

export default PendingVendorDetails
