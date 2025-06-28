import React, { ReactElement, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./pages/Home/HomePage";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import SequencesPage from "./pages/Sequences/SequencesPage";
import HelpPage from "./pages/Help/HelpPage";
import FavoriteExercisesPage from "./pages/FavoriteExercises/FavoriteExercisesPage";

import PageLayout from "./components/layouts/PageLayout";

const App = () => {
  const [authorized, setAuthorized] = useState(false); // set to true for dev

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
              <PageLayout pageTitle={"Dashboard"}>
                <DashboardPage />
              </PageLayout>
            </PrivateRoute>
          }
        />

        {/* '/settings' PATH */}
        <Route
          path="/settings"
          element={
            <PrivateRoute authorized={authorized}>
              <PageLayout pageTitle={"Settings"}>
                <SettingsPage />
              </PageLayout>
            </PrivateRoute>
          }
        />

        {/* '/help' PATH */}
        <Route
          path="/help"
          element={
            <PrivateRoute authorized={authorized}>
              <PageLayout pageTitle={"Help"}>
                <HelpPage />
              </PageLayout>
            </PrivateRoute>
          }
        />

        {/* '/sequences' PATH */}
        <Route
          path="/sequences"
          element={
            <PrivateRoute authorized={authorized}>
              <PageLayout pageTitle={"Sequences"}>
                <SequencesPage />
              </PageLayout>
            </PrivateRoute>
          }
        />

        {/* '/favorite-exercises' PATH */}
        <Route
          path="/favorite-exercises"
          element={
            <PrivateRoute authorized={authorized}>
              <PageLayout pageTitle={"Favorite Exercises"}>
                <FavoriteExercisesPage />
              </PageLayout>
            </PrivateRoute>
          }
        />

        {/* '/test2' PATH
        <Route
          path="/test2"
          element={
            <PageLayout pageTitle="Test2 (Favorite Exercises)">
              <Test2Page />
            </PageLayout>
          }
        ></Route> */}
      </Routes>
    </Router>
  );
};

export default App;
