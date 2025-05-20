import React, { ReactElement, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layouts/NavbarLayout";

import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./pages/Home/HomePage";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import NewPage from "./pages/New/NewPage"
import SavedPage from "./pages/Saved/SavedPage"
import ExercisesPage from "./pages/Exercises/ExercisesPage"
import HelpPage from "./pages/Help/HelpPage"


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
                <DashboardPage/>
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
                <SettingsPage />
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
                <HelpPage />
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
                <NewPage />
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
                <SavedPage />
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
                <ExercisesPage/>
              </Layout>
            </PrivateRoute>
          }
        />
      
      </Routes>
    </Router>
  );
};

export default App;

