import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Paper, Typography, Box } from '@mui/material';
import { allusersCount, sellerCount, vendorsCount } from '../features/UserFeature';
import { totalSalesAdmin, adminMonthlyGraph } from '../features/BuyNowForMeFeatures';
import { totalSAlesAdmin, getMonthlyGraphAdmin } from '../features/ProceedTocheckoutFeature';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const cardData = [
  { title: 'Total Sales', icon: <ShoppingCartIcon sx={{ fontSize: 40, color: 'white' }} />, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', valueKey: 'sales' },
  { title: 'Total Users', icon: <PeopleIcon sx={{ fontSize: 40, color: 'white' }} />, gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', valueKey: 'users' },
  { title: 'Total Sellers', icon: <StoreIcon sx={{ fontSize: 40, color: 'white' }} />, gradient: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', valueKey: 'sellers' },
  { title: 'Total Vendors', icon: <EmojiEventsIcon sx={{ fontSize: 40, color: 'white' }} />, gradient: 'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)', valueKey: 'vendors' },
];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({ sales: 0, users: 0, sellers: 0, vendors: 0 });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Cards data
        const users = await dispatch(allusersCount()).unwrap();
        const sellers = await dispatch(sellerCount()).unwrap();
        const vendors = await dispatch(vendorsCount()).unwrap();
        const buyNowSales = await dispatch(totalSalesAdmin()).unwrap();
        const proceedSales = await dispatch(totalSAlesAdmin()).unwrap();

        // Total sales for cards
        const totalSales =
          (buyNowSales.totalSales?.[0]?.total || 0) +
          (proceedSales.totalSales?.[0]?.total || 0);

        setStats({
          sales: totalSales,
          users: users.total || 0,
          sellers: sellers.total || 0,
          vendors: vendors.total || 0,
        });

        // Monthly graph data
        const buyNowGraph = await dispatch(adminMonthlyGraph()).unwrap();
        const proceedGraph = await dispatch(getMonthlyGraphAdmin()).unwrap();

        // Prepare month 1-12 default
        const monthDataMap = {};
        for (let i = 1; i <= 12; i++) {
          monthDataMap[i] = { month: `Month ${i}`, TotalSales: 0 };
        }

        // Fill BuyNow data
        buyNowGraph.totalSales.forEach(item => {
          // If _id null, assign month 1 (or you can choose current month)
          const month = item._id ? item._id : 1;
          if (monthDataMap[month]) monthDataMap[month].TotalSales += item.total || 0;
        });

        // Fill Proceed data
        proceedGraph.totalSales.forEach(item => {
          const month = item._id ? item._id : 1;
          if (monthDataMap[month]) monthDataMap[month].TotalSales += item.total || 0;
        });

        // Convert to array sorted by month
        const chartData = Object.values(monthDataMap).sort((a, b) => {
          const aMonth = parseInt(a.month.split(' ')[1]);
          const bMonth = parseInt(b.month.split(' ')[1]);
          return aMonth - bMonth;
        });

        setMonthlyData(chartData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchCounts();
  }, [dispatch]);

  return (
    <Container maxWidth="xl" className="py-6">
      {/* Dashboard Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {cardData.map((card, idx) => (
          <Paper
            key={idx}
            elevation={6}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              borderRadius: 3,
              minHeight: 120,
              background: card.gradient,
              color: 'white',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              },
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{card.title}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                {card.valueKey === 'sales' ? `Rs ${stats[card.valueKey]}` : stats[card.valueKey]}
              </Typography>
            </Box>
            <Box>{card.icon}</Box>
          </Paper>
        ))}
      </div>

      {/* Simple Monthly Sales Graph */}
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Monthly Sales Graph</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlyData}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="TotalSales" stroke="#ff7300" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
