import { useState } from "react";
import {
    BrowserRouter as Router,
    Navigate,
    Routes,
    Route,
} from "react-router-dom";

import AuthPage from "./pages/auth/AuthPage";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SequencesPage from "./pages/Sequences/SequencesPage";
import FavoriteExercisesPage from "./pages/favorite-exercises/FavoriteExercisesPage";

import PageLayout from "./components/layouts/PageLayout";
import { SequenceDetailPage } from "./pages/Sequences/SequenceDetailPage";
import SequenceCreatePage from "./pages/Sequences/SequenceCreatePage";
import SequenceEditPage from "./pages/Sequences/SequenceEditPage";
import { SequenceRunPage } from "./pages/Sequences/SequenceRunPage";

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
                            <PageLayout pageTitle={"My Sequences"}>
                                <SequencesPage />
                            </PageLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/sequences/create"
                    element={
                        <PrivateRoute authorized={authorized}>
                            <PageLayout pageTitle={"Create a sequence."}>
                                <SequenceCreatePage />
                            </PageLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/sequences/edit/:id"
                    element={
                        <PrivateRoute authorized={authorized}>
                            <PageLayout pageTitle={"Edit your sequence."}>
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
                            <PageLayout pageTitle={"Sequence Details"}>
                                <SequenceDetailPage />
                            </PageLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
