import type { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import ProfilePage from "./components/ProfilePage";
import SubBagianPage from "./components/SubBagianPage";
import BeritaPage from "./pages/BeritaPage";
import BeritaDetailPage from "./pages/BeritaDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDataEditorPage from "./pages/AdminDataEditorPage";
import ArsipPage from "./pages/ArsipPage";
import { adminAuth } from "./utils/adminAuth";


const AdminRoute = ({ children }: { children: ReactNode }) => {
  const token = adminAuth.getToken();
  return token ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router basename="/app">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/berita" element={<BeritaPage />} />
            <Route path="/berita/:slug" element={<BeritaDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <AdminRoute>
                  <AdminDataEditorPage />
                </AdminRoute>
              }
            />
            <Route path="/arsip" element={<ArsipPage />} />
            <Route path="/arsip/:category" element={<ArsipPage />} />
            <Route path="/:category/:slug" element={<SubBagianPage />} />
            <Route path="*" element={<Homepage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
