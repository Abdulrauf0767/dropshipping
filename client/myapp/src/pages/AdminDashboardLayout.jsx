import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Dashboard,
  AccountCircle,
  Grading,
  Storefront,
  PendingActions,
  Repartition,
  FileUploadOutlined,
  CategoryOutlined,
  BlockOutlined,
  ReportOutlined,
  LogoutOutlined,
  SettingsOutlined,
  Menu as MenuIcon
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/UserFeature";

const drawerWidth = 280;
const collapsedWidth = 70;

const sideBarData = [
  { icon: Dashboard, title: "Dashboard", link: "/admin/dashboard" },
  { icon: AccountCircle, title: "Users", link: "/admin/users" },
  { icon: Grading, title: "Orders", link: "/admin/orders" },
  { icon: Storefront, title: "Sellers", link: "/admin/sellers" },
  { icon: PendingActions, title: "Pending Sellers", link: "/admin/pending-sellers" },
  { icon: PendingActions, title: "Pending Orders", link: "/admin/pending-orders" },
  { icon: Repartition, title: "Rejected Orders", link: "/admin/rejected-orders" },
  { icon: FileUploadOutlined, title: "Upload Product", link: "/admin/uploadproduct" },
  { icon: CategoryOutlined, title: "Categories", link: "/admin/categories" },
  { icon: BlockOutlined, title: "Blocked Sellers", link: "/admin/blocked-sellers" },
  { icon: BlockOutlined, title: "Blocked Users", link: "/admin/blocked-users" },
  { icon: ReportOutlined, title: "Reports", link: "/admin/reports" },
  { icon: SettingsOutlined, title: "Settings", link: "/admin/settings" },
  { icon: LogoutOutlined, title: "Logout", link: "/", isLogout: true },
];

const theme = createTheme({
  palette: { mode: "light" },
  typography: { fontFamily: "'Roboto', sans-serif" },
});

const AdminDashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const muiTheme = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />

        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "#fff",
            color: "#000",
            transition: muiTheme.transitions.create(["width", "margin"], {
              easing: muiTheme.transitions.easing.sharp,
              duration: muiTheme.transitions.duration.leavingScreen,
            }),
            ml: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
            width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
          }}
        >
          <Toolbar sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(!open)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : collapsedWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxSizing: "border-box",
            transition: muiTheme.transitions.create("width", {
              easing: muiTheme.transitions.easing.sharp,
              duration: muiTheme.transitions.duration.enteringScreen,
            }),
            [`& .MuiDrawer-paper`]: {
              width: open ? drawerWidth : collapsedWidth,
              overflowX: "hidden",
              backgroundColor: "#f8f8f8",
              borderRight: "1px solid #ddd",
              transition: muiTheme.transitions.create("width", {
                easing: muiTheme.transitions.easing.sharp,
                duration: muiTheme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          <Toolbar sx={{ justifyContent: "center", py: 2 }}>
            {open && <Typography variant="h6">Admin</Typography>}
          </Toolbar>
          <List>
            {sideBarData.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.link;

              const listItemStyles = {
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                backgroundColor: isActive ? "#e3f2fd" : "inherit",
                color: isActive ? "#1976d2" : "inherit",
                "&:hover": { backgroundColor: "#e3f2fd", color: "#1976d2" },
                transition: "all 0.3s ease",
              };

              if (item.isLogout) {
                return (
                  <ListItemButton
                    key={index}
                    onClick={handleLogout}
                    sx={listItemStyles}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "red",
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    {open && <ListItemText primary={item.title} />}
                  </ListItemButton>
                );
              }

              return (
                <ListItemButton
                  key={index}
                  component={Link}
                  to={item.link}
                  sx={listItemStyles}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {open && <ListItemText primary={item.title} />}
                </ListItemButton>
              );
            })}
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
            overflowX: "auto",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Toolbar />
          <Box
            sx={{
              p: 3,
              flex: 1,
              minWidth: "max-content",
              overflowX: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboardLayout;