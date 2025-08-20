// UserEarning.jsx
import React, { useEffect, useMemo } from 'react'
import Header from '../components/Header'
import { Container, Paper } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { buyNowSellerearning, proceedSellerSearning } from '../features/UserFeature'

const UserEarning = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Dono APIs fire karo
    dispatch(proceedSellerSearning())
    dispatch(buyNowSellerearning())
  }, [dispatch])

  // --- Selectors (slice me already "data" object aa raha hai)
  const proceed = useSelector((state) => state.user?.proceedSellerEarningResp) || { totalMargin: 0, totalOrders: 0, averageMargin: 0 }
  const buyNow  = useSelector((state) => state.user?.buyNowSellerEarningResp)  || { totalMargin: 0, totalOrders: 0, averageMargin: 0 }

  // Overall summary (weighted average on orders)
  const overall = useMemo(() => {
    const totalMargin = Number(proceed.totalMargin || 0) + Number(buyNow.totalMargin || 0)
    const totalOrders = Number(proceed.totalOrders || 0) + Number(buyNow.totalOrders || 0)
    const averageMargin = totalOrders > 0 ? Math.round(totalMargin / totalOrders) : 0
    return { totalMargin, totalOrders, averageMargin }
  }, [proceed, buyNow])

  const handleWithdraw = () => {
    alert(`Withdraw request submitted for PKR ${overall.totalMargin}`)
  }

  // Simple badge component
  const Pill = ({ children }) => (
    <span className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm">{children}</span>
  )

  return (
    <div className="w-full h-full">
      <Header />

      <Container maxWidth="xl">
        <div className="w-full p-6 flex flex-col items-center gap-y-6">

          {/* Main Card */}
          <Paper
            elevation={6}
            className="w-full max-w-4xl"
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
            }}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Wallet Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2h-3.5a2.5 2.5 0 0 0 0 5H19v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M16 11.5h3.5a1.5 1.5 0 0 1 0 3H16a1.5 1.5 0 0 1 0-3z" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                  <div>
                    <h2 className="text-xl font-semibold leading-tight">Seller Earnings</h2>
                    <p className="text-white/80 text-sm">Proceed + Buy Now overview</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Pill>Total Orders: {overall.totalOrders}</Pill>
                  <Pill>Avg Margin: PKR {overall.averageMargin}</Pill>
                </div>
              </div>

              {/* Overall Stats */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-white/80">Total Margin</div>
                  <div className="text-2xl font-bold mt-1">PKR {overall.totalMargin}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-white/80">Total Orders</div>
                  <div className="text-2xl font-bold mt-1">{overall.totalOrders}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-sm text-white/80">Average Margin</div>
                  <div className="text-2xl font-bold mt-1">PKR {overall.averageMargin}</div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proceed Section */}
                <div className="border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Truck Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h11v7H3zM14 9h4l3 3v1h-7z" stroke="currentColor" strokeWidth="1.6" />
                      <circle cx="7" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
                      <circle cx="17" cy="17" r="2" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    <h3 className="text-lg font-semibold">Proceed Orders</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Margin</span>
                      <span className="font-semibold">PKR {proceed.totalMargin}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-semibold">{proceed.totalOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Margin</span>
                      <span className="font-semibold">PKR {proceed.averageMargin}</span>
                    </div>
                  </div>
                </div>

                {/* Buy Now Section */}
                <div className="border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    {/* Lightning Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-violet-600" viewBox="0 0 24 24" fill="none">
                      <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    <h3 className="text-lg font-semibold">Buy Now Orders</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Margin</span>
                      <span className="font-semibold">PKR {buyNow.totalMargin}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-semibold">{buyNow.totalOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Margin</span>
                      <span className="font-semibold">PKR {buyNow.averageMargin}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Withdraw CTA */}
              <div className="mt-6 flex items-center justify-between gap-3 flex-col sm:flex-row">
                <div className="text-gray-600 text-sm">
                  Available to withdraw: <span className="font-semibold text-gray-900">PKR {overall.totalMargin}</span>
                </div>
                <button
                  onClick={handleWithdraw}
                  className="w-full sm:w-auto px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium transition"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </Paper>
        </div>
      </Container>
    </div>
  )
}

export default UserEarning