import React, { ReactElement, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  const [authorized, setAuthorized] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authorized ? (
              <Navigate to="/home" />
            ) : (
              <AuthPage onLogin={() => setAuthorized(true)} />
            )
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute authorized={authorized}>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;


// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;
