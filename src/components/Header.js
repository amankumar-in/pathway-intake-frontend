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
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import HomeIcon from "@mui/icons-material/Home";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";

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
  const location = useLocation();
  const navigate = useNavigate();

  // Menu states
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [navMenuAnchor, setNavMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [formsMenuAnchor, setFormsMenuAnchor] = useState(null);

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

  // Handle logout with menu close
  const handleLogout = () => {
    handleUserMenuClose();
    logout();
  };

  // Handle document selection
  const handleSelectDocument = (documentData) => {
    // Close the document selector
    setShowDocumentSelector(false);

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
            {/* Logo and Brand */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <RouterLink to="/">
                <img
                  src={require("../logo.svg").default}
                  alt="Pathway Logo"
                  style={{
                    height: 40,
                    marginRight: 16,
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </RouterLink>

              {/* Mobile logo */}
            </Box>

            {/* Navigation Menu - only shown if logged in */}
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

                {/* Enhanced Forms Menu */}
                <Popover
                  open={Boolean(formsMenuAnchor)}
                  anchorEl={formsMenuAnchor}
                  onClose={handleFormsMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      width: 650,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 3,
                    },
                  }}
                >
                  <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Create New Form or Document
                    </Typography>
                    <Typography variant="body2">
                      Select the type of form or document you want to create
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      component={RouterLink}
                      to="/intake-form"
                      startIcon={<AssignmentIcon />}
                      onClick={handleFormsMenuClose}
                      sx={{ mb: 2 }}
                    >
                      Start New Intake Form
                    </Button>

                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Create Individual Documents
                    </Typography>

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => {
                        setShowDocumentSelector(true);
                        handleFormsMenuClose();
                      }}
                      sx={{ mb: 2 }}
                    >
                      Create Standalone Document
                    </Button>
                  </Box>
                  <Divider />
                  {/* Document reference list - informational only */}

                  <Box sx={{ px: 2, py: 2, bgcolor: "rgba(0, 0, 0, 0.02)" }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                    >
                      <InfoIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Available document types (create using the button above)
                    </Typography>

                    {/* Masonry layout using CSS columns */}
                    <Box
                      sx={{
                        columnCount: { xs: 1, sm: 2, md: 3 },
                        columnGap: 2,
                        columnRule: "1px solid rgba(0, 0, 0, 0.08)", // Adds subtle divider between columns
                        orphans: 1,
                        widows: 1,
                      }}
                    >
                      {documentCategories.map((category) => (
                        <Box
                          key={category.name}
                          sx={{
                            breakInside: "avoid",
                            pageBreakInside: "avoid",
                            mb: 2,
                            pb: 1.5,
                            display: "inline-block",
                            width: "100%",
                            borderBottom: "1px solid rgba(0, 0, 0, 0.05)", // Horizontal divider between categories
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: category.color,
                              mb: 0.5,
                            }}
                          >
                            {React.cloneElement(category.icon, {
                              fontSize: "small",
                              sx: { mr: 0.5 },
                            })}
                            {category.name}
                          </Typography>

                          {category.documents.map((doc, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                pl: 1.5,
                                py: 0.25,
                                color: "text.secondary",
                                borderBottom:
                                  index < category.documents.length - 1
                                    ? "1px dotted rgba(0,0,0,0.1)"
                                    : "none",
                              }}
                            >
                              <span
                                style={{ fontSize: "8px", marginRight: "6px" }}
                              >
                                •
                              </span>
                              {doc}
                            </Typography>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Popover>
              </Box>
            )}

            {/* Spacer */}
            <Box sx={{ flexGrow: 1 }} />

            {/* User Section */}
            {user ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {/* User Profile & Menu */}
                <Box
                  sx={{
                    ml: 2,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={handleUserMenuOpen}
                >
                  {!isMobile && (
                    <Box sx={{ mr: 2, textAlign: "right" }}>
                      <Typography variant="body2" component="div">
                        {user.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        component="div"
                        sx={{
                          color: getUserRoleColor(),
                          fontWeight: "bold",
                          textShadow: "0px 0px 1px rgba(0,0,0,0.5)",
                        }}
                      >
                        {user.role}
                      </Typography>
                    </Box>
                  )}

                  <Tooltip title="Account settings">
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: getUserRoleColor(),
                        border: "2px solid white",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      {getUserInitials()}
                    </Avatar>
                  </Tooltip>
                </Box>

                {/* User Menu */}
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  onClick={handleUserMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      width: 200,
                    },
                  }}
                >
                  <Box
                    sx={{ px: 2, py: 1, display: { xs: "block", sm: "none" } }}
                  >
                    <Typography variant="subtitle2">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.role}
                    </Typography>
                  </Box>

                  <Divider sx={{ display: { xs: "block", sm: "none" } }} />

                  <MenuItem component={RouterLink} to="/">
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>

                  <Divider />

                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
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
