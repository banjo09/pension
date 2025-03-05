import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./services/store";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContributionsPage from "./pages/ContributionsPage";
import StatementsPage from "./pages/StatementsPage";

import AuthGuard from "./components/auth/AuthGuard";
// import ToastNotification from "./components/notifications/ToastNotification";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen font-sans antialiased bg-gray-50">
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <DashboardPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/contributions"
                  element={
                    <AuthGuard>
                      <ContributionsPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/statements"
                  element={
                    <AuthGuard>
                      <StatementsPage />
                    </AuthGuard>
                  }
                />

                {/* Fallback route */}
                <Route path="*" element={<LoginPage />} />
              </Routes>
              {/* <ToastNotification
                message={notification.message}
                type={notification.type}
                onClose={() => {}}
                id={(Math.random() * 100).toString()}
              /> */}
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;























// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
