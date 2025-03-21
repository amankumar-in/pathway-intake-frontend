import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Home as HomeIcon,
  AssignmentInd as AssignmentIndIcon,
} from "@mui/icons-material";
import { AuthContext } from "../context/AuthContext";
// Import logo directly
import logo from "../logo.svg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  // Added animation effect for the login card
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Delay to allow for a smooth animation
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: { xs: 4, md: 6 },
          marginBottom: { xs: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Logo and Agency Name */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Replace child icon with actual logo */}
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Pathway Foster Agency Logo"
              style={{ height: "80px" }}
            />
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Document Management System
          </Typography>
        </Box>

        {/* Login Card */}
        <Fade in={showCard} timeout={500}>
          <Card
            elevation={4}
            sx={{
              width: "100%",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 12px 48px rgba(0,0,0,0.16)",
              },
            }}
          >
            {/* Card Header */}
            <Box sx={{ bgcolor: "primary.main", color: "white", p: 3 }}>
              <Typography component="h2" variant="h5" fontWeight="medium">
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Please sign in to access your account
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{ mb: 3, borderRadius: 1 }}
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              {/* Login Icons Display */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 4,
                  mb: 3,
                  mt: 1,
                }}
              >
                {[HomeIcon, PersonIcon, AssignmentIndIcon].map((Icon, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.07),
                      color: "primary.main",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 28 }} />
                  </Box>
                ))}
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 2,
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 2,
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 4,
                    py: 1.5,
                    borderRadius: 1.5,
                    position: "relative",
                    fontWeight: "medium",
                    boxShadow: theme.shadows[4],
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                      Signing in...
                    </Box>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Divider sx={{ mt: 4, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Secure Access
                  </Typography>
                </Divider>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "center" }}
                >
                  This system is for authorized personnel only. All activities
                  may be monitored.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </Container>
  );
};

export default Login;
