import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AccountCircle,
  BlockOutlined,
  CategoryOutlined,
  Dashboard,
  FileUploadOutlined,
  Grading,
  LogoutOutlined,
  PendingActions,
  Repartition,
  ReportOutlined,
  SettingsOutlined,
  Storefront
} from '@mui/icons-material'
import { useDispatch } from 'react-redux'
import { logout } from '../features/UserFeature'

const AdminSidebar = () => {
  const navigate = useNavigate()
    const dispatch = useDispatch() 
  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const sideBarData = [
    {
      icon: Dashboard,
      title: 'Dashboard',
      link: '/admin/dashboard'
    },
    {
      icon: AccountCircle,
      title: 'Users',
      link: '/admin/users'
    },
    {
      icon: Grading,
      title: 'Orders',
      link: '/admin/orders'
    },
    {
      icon: Storefront,
      title: 'Sellers',
      link: '/admin/sellers'
    },
    {
      icon: PendingActions,
      title: 'Pending Sellers',
      link: '/admin/pending-sellers'
    },
    {
      icon: PendingActions,
      title: 'Pending Orders',
      link: '/admin/pending-orders'
    },
    {
      icon: Repartition,
      title: 'Rejected Orders',
      link: '/admin/rejected-orders'
    },
    {
      icon: FileUploadOutlined,
      title: 'Upload Product',
      link: '/admin/uploadproduct'
    },
    {
      icon: CategoryOutlined,
      title: 'Categories',
      link: '/admin/categories'
    },
    {
      icon: BlockOutlined,
      title: 'Blocked Sellers',
      link: '/admin/blocked-sellers'
    },
    {
      icon: BlockOutlined,
      title: 'Blocked Users',
      link: '/admin/blocked-users'
    },
    {
      icon: ReportOutlined,
      title: 'Reports',
      link: '/admin/reports'
    },
    {
      icon: LogoutOutlined,
      title: 'Logout',
      link: '/', // we won't use this for navigation
      isLogout: true,  // mark logout item
    },
    {
      icon: SettingsOutlined,
      title: 'Settings',
      link: '/admin/settings'
    }
  ]

  return (
    <div className='w-[300px] h-screen flex flex-col p-4 items-start gap-y-3 overflow-hidden overflow-y-auto scrollbar-none bg-white border-r-2 border-gray-200 rounded-md relative z-10'>
      {sideBarData.map((item, index) => {
        const Icon = item.icon
        if (item.isLogout) {
          // Special logout button with red color and click handler
          return (
            <div
              key={index}
              onClick={handleLogout}
              className='w-full font-lisuBusa h-auto flex items-center gap-x-4 cursor-pointer p-2 hover:bg-[#f8f6f6] rounded-md text-red-600 hover:text-red-700'
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handleLogout()
              }}
            >
              <Icon />
              <span>{item.title}</span>
            </div>
          )
        }
        // Normal links
        return (
          <div key={index} className='w-full h-auto flex items-center gap-x-4 cursor-pointer p-2 hover:bg-[#f8f6f6] rounded-md'>
            <Icon />
            <Link to={item.link}>{item.title}</Link>
          </div>
        )
      })}
    </div>
  )
}

export default AdminSidebar
