import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import IntakeForm from "./pages/IntakeForm";
import CollectSignatures from "./pages/CollectSignatures";
import ViewDocuments from "./pages/ViewDocuments";
import ViewDocument from "./pages/ViewDocument";
import EditDocument from "./pages/EditDocument";
import EditForm from "./pages/EditForm";
import StandaloneDocumentForm from "./pages/StandaloneDocumentForm"; // New import
import StandaloneSignatures from "./pages/StandaloneSignatures"; // New import

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <PrivateRoute adminOnly={true}>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/intake-form"
              element={
                <PrivateRoute>
                  <IntakeForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/collect-signatures/:id"
              element={
                <PrivateRoute>
                  <CollectSignatures />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-documents/:id"
              element={
                <PrivateRoute>
                  <ViewDocuments />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-document/:id"
              element={
                <PrivateRoute>
                  <ViewDocument />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-document/:id"
              element={
                <PrivateRoute>
                  <EditDocument />
                </PrivateRoute>
              }
            />
            <Route path="/edit-form/:id" element={<EditForm />} />
            <Route
              path="/standalone-document"
              element={
                <PrivateRoute>
                  <StandaloneDocumentForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/standalone-signatures/:id"
              element={
                <PrivateRoute>
                  <StandaloneSignatures />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
