import { useState } from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Routes,
    Route,
} from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import FavoriteExercisesPage from "./pages/favorite-exercises/FavoriteExercisesPage";

import SequencesPage from "./pages/sequences/SequencesPage";
import SequenceCreatePage from "./pages/sequences/SequenceCreatePage";
import SequenceDetailPage from "./pages/sequences/SequenceDetailPage";
import SequenceEditPage from "./pages/sequences/SequenceEditPage";
import SequenceRunPage from "./pages/sequences/SequenceRunPage";

import PrivateRoute from "./components/PrivateRoute";
import PageLayout from "./components/layouts/PageLayout";

const App = () => {
    const [authorized, setAuthorized] = useState(false);
    const authorizeUser = () => {
        setAuthorized(true);
    };

    return (
        <div className="app">
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
                                <PageLayout pageTitle={""}>
                                    <DashboardPage />
                                </PageLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/favorite-exercises"
                        element={
                            <PrivateRoute authorized={authorized}>
                                <PageLayout pageTitle={"My Favorite Exercises"}>
                                    <FavoriteExercisesPage />
                                </PageLayout>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/sequences"
                        element={
                            <PrivateRoute authorized={authorized}>
                                <PageLayout pageTitle={"My Classes"}>
                                    <SequencesPage />
                                </PageLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/sequences/create"
                        element={
                            <PrivateRoute authorized={authorized}>
                                <PageLayout pageTitle={"Create a class."}>
                                    <SequenceCreatePage />
                                </PageLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/sequences/edit/:id"
                        element={
                            <PrivateRoute authorized={authorized}>
                                <PageLayout pageTitle={"Edit your class."}>
                                    <SequenceEditPage />
                                </PageLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/sequences/run/:id"
                        element={
                            <PrivateRoute authorized={authorized}>
                                <PageLayout pageTitle={""}>
                                    <SequenceRunPage />
                                </PageLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/sequences/:id"
                        element={
                            <PrivateRoute authorized={authorized}>
                                <PageLayout pageTitle={"Class Details"}>
                                    <SequenceDetailPage />
                                </PageLayout>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
