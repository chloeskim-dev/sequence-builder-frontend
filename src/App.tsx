import React, { ReactElement, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import New from "./pages/New"
import Saved from "./pages/Saved"
import Exercises from "./pages/Exercises"
import Help from "./pages/Help"


const App = () => {
  const [authorized, setAuthorized] = useState(false);

  return (
    <Router>
      <Routes>
        
      {/* '/' PATH
        - if authorized: navigate to '/dashboard'
        - else: stay at '/' and display <AuthPage />
      */} 
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
      
      {/* '/help' PATH */} 
        <Route
          path="/help"
          element={
            <PrivateRoute authorized={authorized}>
              <Layout>
                <Help/>
              </Layout>
            </PrivateRoute>
          }
        />


      {/* '/new' PATH */} 
        <Route
          path="/new"
          element={
            <PrivateRoute authorized={authorized}>
              <Layout>
                <New />
              </Layout>
            </PrivateRoute>
          }
        />

      {/* '/saved' PATH */} 
        <Route
          path="/saved"
          element={
            <PrivateRoute authorized={authorized}>
              <Layout>
                <Saved />
              </Layout>
            </PrivateRoute>
          }
        />

      {/* '/exercises' PATH */} 
        <Route
          path="/exercises"
          element={
            <PrivateRoute authorized={authorized}>
              <Layout>
                <Exercises/>
              </Layout>
            </PrivateRoute>
          }
        />
      
      </Routes>
    </Router>
  );
};

export default App;

