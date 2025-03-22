import React, { useState, useEffect } from "react";
import { Lock as LockIcon } from "@mui/icons-material";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  alpha,
  useTheme,
  InputAdornment,
  Divider,
  Grid,
  Avatar,
  Collapse,
  Stack,
  Snackbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  SupervisorAccount as AdminIcon,
  Person as PersonIcon,
  Psychology as CounsellorIcon,
  Work as HRIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { getUsers, registerUser, deleteUser } from "../utils/api";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [success, setSuccess] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    role: "caseworker",
  });
  const [formError, setFormError] = useState("");
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "User Management | Pathway Foster Agency";
  }, []);
  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
      setError("");
    } catch (err) {
      setError(
        "Error fetching users: " + (err.response?.data?.message || err.message)
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setNewUser({
      username: "",
      password: "",
      name: "",
      role: "caseworker",
    });
    setFormError("");
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenDeleteDialog = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddUser = async () => {
    try {
      // Validate form
      if (!newUser.username || !newUser.password || !newUser.name) {
        setFormError("All fields are required");
        return;
      }

      if (newUser.password.length < 6) {
        setFormError("Password must be at least 6 characters");
        return;
      }

      // Submit form
      await registerUser(newUser);
      handleCloseAddDialog();
      setSuccess(`User "${newUser.name}" has been successfully created`);
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || "Error creating user");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id);
      handleCloseDeleteDialog();
      setSuccess(`User "${selectedUser.name}" has been successfully deleted`);
      fetchUsers();
    } catch (err) {
      setError(
        "Error deleting user: " + (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  // Get appropriate icon for role
  const getRoleIcon = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <AdminIcon fontSize="small" />;
      case "counsellor":
        return <CounsellorIcon fontSize="small" />;
      case "hr":
        return <HRIcon fontSize="small" />;
      case "caseworker":
      default:
        return <PersonIcon fontSize="small" />;
    }
  };

  // Get color for role chip
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "error";
      case "counsellor":
        return "info";
      case "hr":
        return "warning";
      case "caseworker":
      default:
        return "success";
    }
  };

  // Generate user avatar with initials
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar color based on role
  const getAvatarColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return theme.palette.error.light;
      case "counsellor":
        return theme.palette.info.light;
      case "hr":
        return theme.palette.warning.light;
      case "caseworker":
      default:
        return theme.palette.success.light;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Card */}
      <Card
        variant="outlined"
        sx={{
          mb: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ bgcolor: "primary.main", color: "white", p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={() => navigate("/")}
                sx={{ color: "white", mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Box>
                <Typography variant="h5" component="h1" fontWeight="medium">
                  User Management
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                  Manage user accounts and access permissions
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenAddDialog}
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.9),
                  },
                }}
              >
                Add New User
              </Button>

              <IconButton
                color="inherit"
                onClick={() => setShowHelp(!showHelp)}
                size="small"
                sx={{
                  bgcolor: alpha("#fff", 0.1),
                  "&:hover": {
                    bgcolor: alpha("#fff", 0.2),
                  },
                }}
              >
                <HelpIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        {/* Help Section - Collapsible */}
        <Collapse in={showHelp}>
          <CardContent
            sx={{
              bgcolor: alpha(theme.palette.info.main, 0.05),
              borderBottom: "1px solid",
              borderColor: alpha(theme.palette.info.main, 0.1),
            }}
          >
            <Typography
              variant="subtitle2"
              color="info.main"
              fontWeight="medium"
              gutterBottom
            >
              <InfoIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", mr: 1 }}
              />
              User Access Levels:
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    size="small"
                    icon={<AdminIcon />}
                    label="Admin"
                    color="error"
                  />
                  <Typography variant="body2">Full system access</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    size="small"
                    icon={<CounsellorIcon />}
                    label="Counsellor"
                    color="info"
                  />
                  <Typography variant="body2">Assessment access</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    size="small"
                    icon={<HRIcon />}
                    label="HR"
                    color="warning"
                  />
                  <Typography variant="body2">Personnel records</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    size="small"
                    icon={<PersonIcon />}
                    label="Caseworker"
                    color="success"
                  />
                  <Typography variant="body2">Standard access</Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Note:</strong> The admin user cannot be deleted. Users
                cannot delete their own accounts.
              </Typography>
            </Box>
          </CardContent>
        </Collapse>

        {/* Search and Filters */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            variant="text"
            color="primary"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </Box>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          variant="filled"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Users Table */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} thickness={4} />
                    <Typography
                      variant="body2"
                      sx={{ mt: 2, color: "text.secondary" }}
                    >
                      Loading user data...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: getAvatarColor(user.role),
                            color: theme.palette.getContrastText(
                              getAvatarColor(user.role)
                            ),
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <Typography variant="body2" fontWeight="medium">
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {user.username !== "admin" ? (
                        <Tooltip title="Delete User">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteDialog(user)}
                            sx={{
                              ml: 1,
                              "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Chip
                          label="System Admin"
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : searchTerm ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <SearchIcon
                      sx={{ fontSize: 40, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="body1" gutterBottom>
                      No users found matching "{searchTerm}"
                    </Typography>
                    <Button
                      variant="text"
                      startIcon={<CloseIcon />}
                      onClick={() => setSearchTerm("")}
                      sx={{ mt: 1 }}
                    >
                      Clear Search
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                    <PersonIcon
                      sx={{ fontSize: 40, color: "text.disabled", mb: 2 }}
                    />
                    <Typography variant="body1" gutterBottom>
                      No users found
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={handleOpenAddDialog}
                      sx={{ mt: 1 }}
                    >
                      Add New User
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table Footer with Info */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderTopColor: "divider",
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {filteredUsers.length} of {users.length} users
            {searchTerm && ` (filtered by "${searchTerm}")`}
          </Typography>
        </Box>
      </Card>

      {/* Add User Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.1),
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonAddIcon color="primary" sx={{ mr: 1.5 }} />
            <Typography variant="h6">Add New User</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {formError && (
            <Alert
              severity="error"
              variant="filled"
              sx={{ mb: 3, borderRadius: 1 }}
              onClose={() => setFormError("")}
            >
              {formError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} >
              <TextField
                name="name"
                label="Full Name"
                type="text"
                fullWidth
                value={newUser.name}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="username"
                label="Username"
                type="text"
                fullWidth
                value={newUser.username}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={newUser.password}
                onChange={handleInputChange}
                required
                helperText="Password must be at least 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
              >
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start">
                      {getRoleIcon(newUser.role)}
                    </InputAdornment>
                  }
                >
                  <MenuItem value="caseworker">Caseworker</MenuItem>
                  <MenuItem value="counsellor">Counsellor</MenuItem>
                  <MenuItem value="hr">HR</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Role description */}
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: alpha(
                theme.palette[getRoleColor(newUser.role)].main,
                0.05
              ),
              borderRadius: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              color={`${getRoleColor(newUser.role)}.main`}
              gutterBottom
            >
              {newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)}{" "}
              Role Permissions:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {newUser.role === "admin" &&
                "Full system access including user management, all documents, and configuration."}
              {newUser.role === "counsellor" &&
                "Access to client assessments, therapy notes, and case planning documents."}
              {newUser.role === "hr" &&
                "Access to personnel records, background checks, and HR documentation."}
              {newUser.role === "caseworker" &&
                "Standard access to client records, intakes, and basic document creation."}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ p: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button onClick={handleCloseAddDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            startIcon={<PersonAddIcon />}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.05),
            borderBottom: "1px solid",
            borderColor: alpha(theme.palette.error.main, 0.1),
            pb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DeleteIcon color="error" sx={{ mr: 1.5 }} />
            <Typography variant="h6">Confirm Delete</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedUser && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: getAvatarColor(selectedUser.role),
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                {getInitials(selectedUser.name)}
              </Avatar>
              <Box>
                <Typography variant="h6">{selectedUser.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser.username} • {selectedUser.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
            This action cannot be undone. The user will lose all access to the
            system.
          </Alert>

          <DialogContentText>
            Are you sure you want to delete this user? If they need access again
            in the future, you'll need to create a new account.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ p: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
        >
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(success)}
        autoHideDuration={5000}
        onClose={() => setSuccess("")}
        message={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CheckIcon sx={{ mr: 1 }} />
            {success}
          </Box>
        }
        sx={{ "& .MuiSnackbarContent-root": { bgcolor: "success.main" } }}
      />
    </Container>
  );
};

// Missing LockIcon import

export default UserManagement;
