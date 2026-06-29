import React, { Suspense, useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import TaskModal from "./components/TaskModal";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuthStore from "./store/useAuthStore";
import useAppStore from "./store/useAppStore";

import Login from "./pages/Login";

const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Board     = React.lazy(() => import("./pages/Board"));
const Tasks     = React.lazy(() => import("./pages/Tasks"));
const Sprints   = React.lazy(() => import("./pages/Sprints"));
const Goals     = React.lazy(() => import("./pages/Goals"));
const Reports   = React.lazy(() => import("./pages/Reports"));
const Team      = React.lazy(() => import("./pages/Team"));
const Backlog   = React.lazy(() => import("./pages/Backlog"));
const Timeline  = React.lazy(() => import("./pages/Timeline"));
const Settings  = React.lazy(() => import("./pages/Settings"));
const About     = React.lazy(() => import("./pages/About"));
const Manual    = React.lazy(() => import("./pages/Manual"));



function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isDesktop;
}

function LoadingBar() {
  const { loading } = useAppStore();
  const isLoading = Object.values(loading).some(Boolean);
  if (!isLoading) return null;
  return (
    <div style={{
      position: "fixed", top: 60, left: 0, right: 0, height: 2, zIndex: 100,
      background: "var(--border-subtle)",
    }}>
      <div style={{
        height: "100%",
        background: "linear-gradient(90deg, #6366f1, #a78bfa, #6366f1)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.2s linear infinite",
        width: "60%",
      }} />
    </div>
  );
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const showSidebar = isDesktop || sidebarOpen;
  const { fetchAll } = useAppStore();

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-base)" }}>

      {/* Mobile overlay */}
      {!isDesktop && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className="sidebar-panel" style={{
        position: isDesktop ? "relative" : "fixed",
        top: 0, left: 0, bottom: 0,
        width: 256,
        flexShrink: 0,
        zIndex: isDesktop ? "auto" : 50,
        transform: showSidebar ? "translateX(0)" : "translateX(-100%)",
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="page-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px", marginTop: 60, background: "var(--bg-base)" }}>
          <LoadingBar />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/"          element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/board"     element={<Board />} />
              <Route path="/list"      element={<Tasks />} />
              <Route path="/timeline"  element={<Timeline />} />
              <Route path="/backlog"   element={<Backlog />} />
              <Route path="/goals"     element={<Goals />} />
              <Route path="/sprints"   element={<Sprints />} />
              <Route path="/reports"   element={<Reports />} />
              <Route path="/team"      element={<Team />} />
              <Route path="/settings"  element={<Settings />} />
              <Route path="/about"     element={<About />} />
              <Route path="/manual"    element={<Manual />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <TaskModal />
    </div>
  );
}

function LoginRoute() {
  const { isLoggedIn } = useAuthStore();
  if (isLoggedIn) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

export default function App() {
  const { isLoggedIn } = useAuthStore();
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/*" element={isLoggedIn ? <AppShell /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
