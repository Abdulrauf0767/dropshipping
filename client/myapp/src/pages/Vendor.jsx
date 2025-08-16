import React, { useEffect } from 'react'
import {Button} from '@mui/material'
import { useDispatch } from 'react-redux'
import { logout } from '../features/UserFeature'
const Vendor = () => {
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logout())
    }
  return (
    <div>
      vendor
      <Button onClick={handleLogout}  variant='outlined' color='error' >Logut</Button>
    </div>
  )
}

export default Vendor
