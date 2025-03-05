import React, { Suspense, lazy } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./services/store";
// import { ErrorBoundary } from "react-error-boundary";
import Navigation from "./components/shared/Navigation";
import AuthGuard from "./components/auth/AuthGuard";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import Loading from "./components/shared/Loading";
import ErrorFallback from "./components/shared/ErrorFallback";

// Lazy load routes
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ContributionsPage = lazy(() => import("./pages/ContributionsPage"));
const StatementsPage = lazy(() => import("./pages/StatementsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const MembersPage = lazy(() => import("./pages/MembersPage"));

const App: React.FC = React.memo(() => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Authentication routes without Navigation */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<LoginPage />} />

              {/* Protected routes with Navigation */}
              <Route element={<Navigation />}>
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
                <Route 
                  path="/analytics" 
                  element={
                    <AuthGuard>
                      <AnalyticsPage />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/members" 
                  element={
                    <AuthGuard>
                      <MembersPage />
                    </AuthGuard>
                  } 
                />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </Provider>
  );
});

export default App;


























// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./services/store";

// import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
// import ContributionsPage from "./pages/ContributionsPage";
// import StatementsPage from "./pages/StatementsPage";

// import AuthGuard from "./components/auth/AuthGuard";
// // import ToastNotification from "./components/notifications/ToastNotification";
// import { NotificationProvider } from "./context/NotificationContext";
// import { AuthProvider } from "./context/AuthContext";

// const App: React.FC = () => {
//   return (
//     <Provider store={store}>
//       <AuthProvider>
//         <NotificationProvider>
//           <Router>
//             <div className="min-h-screen font-sans antialiased bg-gray-50">
//               <Routes>
//                 <Route path="/" element={<LoginPage />} />
//                 <Route path="/login" element={<LoginPage />} />

//                 <Route
//                   path="/dashboard"
//                   element={
//                     <AuthGuard>
//                       <DashboardPage />
//                     </AuthGuard>
//                   }
//                 />
//                 <Route
//                   path="/contributions"
//                   element={
//                     <AuthGuard>
//                       <ContributionsPage />
//                     </AuthGuard>
//                   }
//                 />
//                 <Route
//                   path="/statements"
//                   element={
//                     <AuthGuard>
//                       <StatementsPage />
//                     </AuthGuard>
//                   }
//                 />

//                 {/* Fallback route */}
//                 <Route path="*" element={<LoginPage />} />
//               </Routes>
//               {/* <ToastNotification
//                 message={notification.message}
//                 type={notification.type}
//                 onClose={() => {}}
//                 id={(Math.random() * 100).toString()}
//               /> */}
//             </div>
//           </Router>
//         </NotificationProvider>
//       </AuthProvider>
//     </Provider>
//   );
// };

// export default App;























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
