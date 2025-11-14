import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Grid,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Lock,
  Person,
  Badge,
  CalendarToday,
  Description,
  Assignment,
} from "@mui/icons-material";
import {
  getUserData,
  updateUserRole,
  resetUserPassword,
} from "../utils/api";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [tabValue, setTabValue] = useState(0);

  // Dialog states
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserData(id);
      setUserData(response.data);
      setNewRole(response.data.user.role);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to load user data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async () => {
    try {
      await updateUserRole(id, newRole);
      setMessage({
        type: "success",
        text: "User role updated successfully",
      });
      setRoleDialogOpen(false);
      fetchUserData();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to update user role",
      });
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match",
      });
      return;
    }

    try {
      await resetUserPassword(id, newPassword);
      setMessage({
        type: "success",
        text: "Password reset successfully",
      });
      setPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Failed to reset password",
      });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error";
      case "counsellor":
        return "info";
      case "hr":
        return "warning";
      case "socialworker":
        return "success";
      default:
        return "default";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "counsellor":
        return "Counsellor";
      case "hr":
        return "HR";
      case "socialworker":
        return "Social Worker";
      default:
        return role;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading user profile...
        </Typography>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">User not found</Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/user-management")}
          sx={{ mt: 2 }}
        >
          Back to User Management
        </Button>
      </Container>
    );
  }

  const { user, counts, intakeForms, documents } = userData;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/user-management")}
        sx={{ mb: 2 }}
      >
        Back to User Management
      </Button>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage({ type: "", text: "" })}>
          {message.text}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* User Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: "2.5rem",
              mr: 3,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">{user.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              @{user.username}
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={getRoleLabel(user.role)}
                color={getRoleColor(user.role)}
                sx={{ mr: 1 }}
              />
            </Box>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => setRoleDialogOpen(true)}
              sx={{ mr: 1 }}
              disabled={user.username === "admin"}
            >
              Change Role
            </Button>
            <Button
              variant="outlined"
              startIcon={<Lock />}
              onClick={() => setPasswordDialogOpen(true)}
              color="secondary"
            >
              Reset Password
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* User Details */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Person sx={{ mr: 1, color: "text.secondary" }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Username
                </Typography>
                <Typography variant="body1">{user.username}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Badge sx={{ mr: 1, color: "text.secondary" }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">
                  {getRoleLabel(user.role)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarToday sx={{ mr: 1, color: "text.secondary" }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {formatDate(user.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Assignment sx={{ mr: 1, color: "text.secondary" }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {user.id}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "primary.light",
                color: "white",
              }}
            >
              <Typography variant="h3">{counts.intakeForms}</Typography>
              <Typography variant="body1">Intake Forms</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "secondary.light",
                color: "white",
              }}
            >
              <Typography variant="h3">{documents.filter(d => d.standAlone).length}</Typography>
              <Typography variant="body1">Standalone Documents</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs for Forms and Documents */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`Intake Forms (${intakeForms.length})`} />
            <Tab label={`Standalone Documents (${documents.filter(d => d.standAlone).length})`} />
          </Tabs>
        </Box>

        {/* Intake Forms Table */}
        {tabValue === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Case Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Archived</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {intakeForms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No intake forms found
                    </TableCell>
                  </TableRow>
                ) : (
                  intakeForms.map((form) => (
                    <TableRow key={form._id}>
                      <TableCell>{form.name}</TableCell>
                      <TableCell>{form.caseNumber}</TableCell>
                      <TableCell>
                        <Chip label={form.status} size="small" />
                      </TableCell>
                      <TableCell>{formatDate(form.createdAt)}</TableCell>
                      <TableCell>
                        {form.archived ? (
                          <Chip label="Yes" size="small" color="warning" />
                        ) : (
                          <Chip label="No" size="small" color="success" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Documents Table - Only Standalone */}
        {tabValue === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.filter((doc) => doc.standAlone).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No standalone documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  documents
                    .filter((doc) => doc.standAlone)
                    .map((doc) => (
                      <TableRow key={doc._id}>
                        <TableCell>{doc.title}</TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Change Role Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="admin">Administrator</MenuItem>
              <MenuItem value="socialworker">Social Worker</MenuItem>
              <MenuItem value="counsellor">Counsellor</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRoleUpdate}
            variant="contained"
            disabled={newRole === user.role}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reset User Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            helperText="Password must be at least 6 characters"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handlePasswordReset}
            variant="contained"
            color="secondary"
            disabled={!newPassword || !confirmPassword}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;
