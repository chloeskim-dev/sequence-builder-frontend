import { useState } from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Routes,
    Route,
} from "react-router-dom";

import AuthPage from "./pages/Auth/AuthPage";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SequencesPage from "./pages/Sequences/SequencesPage";
import FavoriteExercisesPage from "./pages/FavoriteExercises/FavoriteExercisesPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import HelpPage from "./pages/Help/HelpPage";

import PageLayout from "./components/layouts/PageLayout";

const App = () => {
    const [authorized, setAuthorized] = useState(false);
    const authorizeUser = () => {
        setAuthorized(true);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        !authorized ? (
                            <AuthPage authorizeUser={authorizeUser} />
                        ) : (
                            <Navigate to="/dashboard" />
                        )
                    }
                />
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
            </Routes>
        </Router>
    );
};

export default App;
