import React, { ReactElement, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

const App = () => {
  const [authorized, setAuthorized] = useState(false);

  return (
    <Router>
      <Routes>
        
      {/* '/' PATH */} 
        <Route
          path="/"
          element={
            authorized ? (
              <Navigate to="/dashboard" />
            ) : (
              <AuthPage onLogin={() => setAuthorized(true)} />
            )
          }
        />

      {/* '/dashboard' PATH */} 
        <Route
          path="/dashboard"
          element={
            <PrivateRoute authorized={authorized}>
              <Layout>
                <Dashboard/>
              </Layout>
            </PrivateRoute>
          }
        />

      
      {/* '/settings' PATH */} 
        <Route
          path="/settings"
          element={
            <PrivateRoute authorized={authorized}>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

