import React from 'react'
import {AccountCircleOutlined, NotificationAdd, NotificationsNoneOutlined} from '@mui/icons-material'
const AdminDashboard = () => {
  return (
    <div className='w-full h-screen ' >
      <header className='w-full h-20 shadow-sm' >
        <nav className='w-full h-full flex items-center justify-end gap-x-3  '>
            <span className='w-[60px] h-[60px] flex items-center justify-center ' >
           <NotificationsNoneOutlined style={{fontSize:"30px"}}  /> 
            </span>
            <span className='w-[60px] h-[60px] flex items-center justify-center ' >
           <AccountCircleOutlined style={{fontSize:"30px"}}  />
            </span>
        </nav>
      </header>
    </div>
  )
}

export default AdminDashboard
