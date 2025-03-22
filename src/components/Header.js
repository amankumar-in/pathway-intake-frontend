import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Popover,
  IconButton,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import HomeIcon from "@mui/icons-material/Home";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import MenuIcon from "@mui/icons-material/Menu";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DescriptionIcon from "@mui/icons-material/Description";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";

// Import DocumentTypeSelector
import DocumentTypeSelector from "../components/DocumentTypeSelector";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const location = useLocation();
  const navigate = useNavigate();

  // Menu states
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [navMenuAnchor, setNavMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [formsMenuAnchor, setFormsMenuAnchor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dialog states
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);

  // Sample notifications (in a real app, these would come from an API)
  const notifications = [
    { id: 1, message: "New form submitted for review", read: false },
    {
      id: 2,
      message: "Case update: Johnson family meeting scheduled",
      read: false,
    },
    { id: 3, message: "Document approval required", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle menu open/close
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const handleNavMenuOpen = (event) => setNavMenuAnchor(event.currentTarget);
  const handleNavMenuClose = () => setNavMenuAnchor(null);

  const handleNotificationsOpen = (event) =>
    setNotificationsAnchor(event.currentTarget);
  const handleNotificationsClose = () => setNotificationsAnchor(null);

  const handleFormsMenuOpen = (event) =>
    setFormsMenuAnchor(event.currentTarget);
  const handleFormsMenuClose = () => setFormsMenuAnchor(null);

  // Handle mobile menu
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Handle logout with menu close
  const handleLogout = () => {
    handleUserMenuClose();
    closeMobileMenu();
    logout();
  };

  // Handle document selection
  const handleSelectDocument = (documentData) => {
    // Close the document selector
    setShowDocumentSelector(false);
    closeMobileMenu();

    // Encode the document data to pass via URL
    const encodedData = encodeURIComponent(JSON.stringify(documentData));

    // Navigate to the standalone document form
    navigate(`/standalone-document?documentData=${encodedData}`);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get user role color
  const getUserRoleColor = () => {
    if (!user) return theme.palette.grey[500];

    switch (user.role?.toLowerCase()) {
      case "admin":
        return "#FFD700"; // Gold color for admin
      case "case worker":
        return "#90EE90"; // Light green for case worker
      case "supervisor":
        return "#E0F7FA"; // Light cyan for supervisor
      default:
        return "#FFFFFF"; // White for others
    }
  };

  // todo Document categories for the menu (Information only)
  const documentCategories = [
    {
      name: "Intake Paperwork",
      color: "#ec407a",
      icon: <AssignmentIcon fontSize="small" />,
      documents: [
        "Notice of Action",
        "ID-Emergency Information",
        "Agency to Agency Agreement",
        "County Worker Grievance Guidelines",
        "CHDP Form",
        "Confirm Ambulatory Status",
        "Home Placement Log",
        "Consent to Release Medical/Confidential Information Authorization",
      ],
    },
    {
      name: "Shelter Bed Documents",
      color: "#26a69a",
      icon: <HomeIcon fontSize="small" />,
      documents: [
        "Agency to Foster Parent",
        "Client Personal Rights",
        "Record of Client Cash Resources",
        "Client Initial Care Plan",
        "Client Discharge",
        "Acknowledgement of Prior Information",
        "Quarterly Clothing Allowance",
        "Quarterly Spending Allowance",
        "Placement Application",
      ],
    },
    {
      name: "Medical & Consent Forms",
      color: "#2196f3",
      icon: <MedicalServicesIcon fontSize="small" />,
      documents: [
        "Consent For Medical Treatment",
        "PRN Authorization Letter",
        "PRN Page 2",
        "Confirm T.B. Test",
        "Monthly Medication Record",
        "Medication & Destruction Record",
        "Dental Treatment Record",
      ],
    },
    {
      name: "Guidelines & Policies",
      color: "#ff9800",
      icon: <DescriptionIcon fontSize="small" />,
      documents: [
        "Client Grievance Guidelines",
        "Client Disciplinary P. & P.",
        "Emergency Information Log",
        "Foster Parent Checklist",
      ],
    },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={3}
        sx={{
          background: "#1976d2",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile Menu Icon - only shown if logged in and on mobile */}
            {user && isMobile && (
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="start"
                onClick={toggleMobileMenu}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo and Brand - positioned after menu icon on mobile */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
              }}
            >
              <RouterLink to="/">
                <img
                  src={require("../logo.svg").default}
                  alt="Pathway Logo"
                  style={{
                    height: 40,
                    marginRight: isMobile ? 0 : 16,
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </RouterLink>
            </Box>

            {/* Navigation Menu - only shown if logged in and not on mobile */}
            {user && !isMobile && (
              <Box sx={{ display: "flex", ml: 2 }}>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/"
                  startIcon={<DashboardIcon />}
                  sx={{
                    mx: 1,
                    opacity: location.pathname === "/" ? 1 : 0.8,
                    fontWeight: location.pathname === "/" ? "bold" : "normal",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  color="inherit"
                  startIcon={<FolderIcon />}
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={handleFormsMenuOpen}
                  sx={{
                    mx: 1,
                    opacity: 0.8,
                    "&:hover": { opacity: 1 },
                  }}
                >
                  Forms
                </Button>
                {user && user.role === "admin" && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/user-management"
                    startIcon={<PeopleIcon />}
                    sx={{
                      mx: 1,
                      opacity:
                        location.pathname === "/user-management" ? 1 : 0.8,
                      fontWeight:
                        location.pathname === "/user-management"
                          ? "bold"
                          : "normal",
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    Users
                  </Button>
                )}
              </Box>
            )}

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* User Section */}
            {user ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* User Profile & Menu - responsive text sizes and margins */}
                <Box
                  sx={{
                    ml: { xs: 1, sm: 1.5, md: 2 },
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleUserMenuOpen}
                >
                  {/* Hide text on mobile, use smaller text on tablet */}
                  {!isMobile && (
                    <Box
                      sx={{
                        mr: { xs: 1, sm: 1.5, md: 2 },
                        textAlign: "right",
                        maxWidth: { xs: 90, sm: 110, md: 150 },
                      }}
                    >
                      <Typography
                        variant="body2"
                        component="div"
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.875rem",
                          },
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="div"
                        sx={{
                          color: getUserRoleColor(),
                          fontWeight: "bold",
                          textShadow: "0px 0px 1px rgba(0,0,0,0.5)",
                          fontSize: {
                            xs: "0.6rem",
                            sm: "0.65rem",
                            md: "0.7rem",
                          },
                        }}
                      >
                        {user.role}
                      </Typography>
                    </Box>
                  )}

                  <Tooltip title="Account settings">
                    <Avatar
                      sx={{
                        width: { xs: 32, sm: 34, md: 36 },
                        height: { xs: 32, sm: 34, md: 36 },
                        bgcolor: getUserRoleColor(),
                        border: "2px solid white",
                        fontWeight: "bold",
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              // Login button for non-authenticated users
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            pt: 1,
          },
        }}
      >
        {user && (
          <>
            {/* User Info at top of drawer */}
            <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: getUserRoleColor(),
                  mr: 2,
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{user.name}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: "medium",
                  }}
                >
                  {user.role}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 1 }} />

            {/* Navigation Links */}
            <List>
              <ListItem
                button
                component={RouterLink}
                to="/"
                onClick={closeMobileMenu}
                selected={location.pathname === "/"}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  closeMobileMenu();
                  navigate("/intake-form");
                }}
              >
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="New Intake Form" />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  setShowDocumentSelector(true);
                  closeMobileMenu();
                }}
              >
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="New Standalone Document" />
              </ListItem>

              {user.role === "admin" && (
                <ListItem
                  button
                  component={RouterLink}
                  to="/user-management"
                  onClick={closeMobileMenu}
                  selected={location.pathname === "/user-management"}
                >
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary="User Management" />
                </ListItem>
              )}
            </List>

            <Divider />

            {/* Logout Button */}
            <List>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </>
        )}
      </Drawer>

      {/* Document Type Selector Dialog */}
      <DocumentTypeSelector
        open={showDocumentSelector}
        onClose={() => setShowDocumentSelector(false)}
        onSelectDocument={handleSelectDocument}
      />
    </>
  );
};

export default Header;
