import type { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Homepage from "./components/Homepage";
import ProfilePage from "./components/ProfilePage";
import SubBagianPage from "./components/SubBagianPage";
import NotFoundPage from "./components/NotFoundPage";
import BeritaPage from "./pages/BeritaPage";
import BeritaDetailPage from "./pages/BeritaDetailPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDataEditorPage from "./pages/AdminDataEditorPage";
import AdminCmsListPage from "./pages/AdminCmsListPage";
import AdminCmsDetailPage from "./pages/AdminCmsDetailPage";
import AdminCmsEditorPage from "./pages/AdminCmsEditorPage";
import AdminTaxonomyPage from "./pages/AdminTaxonomyPage";
import AdminDocumentListPage from "./pages/AdminDocumentListPage";
import AdminDocumentDetailPage from "./pages/AdminDocumentDetailPage";
import AdminDocumentEditorPage from "./pages/AdminDocumentEditorPage";
import ArsipPage from "./pages/ArsipPage";
import PpidPage from "./pages/PpidPage";
import { adminAuth } from "./utils/adminAuth";


const AdminRoute = ({ children }: { children: ReactNode }) => {
  const isValid = adminAuth.hasValidToken();
  return isValid ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

const AdminLoginRoute = () => (
  adminAuth.hasValidToken()
    ? <Navigate to="/admin/dashboard" replace />
    : <AdminLoginPage />
);

const ApplicationFrame = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const usesDedicatedCmsShell = /^\/admin\/(dashboard|content|posts|pages|documents|categories|tags|document-categories)(\/|$)/.test(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!usesDedicatedCmsShell && <Header />}
      <main className="flex-grow">{children}</main>
      {!usesDedicatedCmsShell && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ApplicationFrame>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/berita" element={<BeritaPage />} />
            <Route path="/berita/:slug" element={<BeritaDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginRoute />} />
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
            <Route
              path="/admin/posts"
              element={
                <AdminRoute>
                  <AdminCmsListPage type="post" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts/new"
              element={
                <AdminRoute>
                  <AdminCmsEditorPage type="post" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts/:id/edit"
              element={
                <AdminRoute>
                  <AdminCmsEditorPage type="post" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages"
              element={
                <AdminRoute>
                  <AdminCmsListPage type="page" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages/new"
              element={
                <AdminRoute>
                  <AdminCmsEditorPage type="page" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages/:id/edit"
              element={
                <AdminRoute>
                  <AdminCmsEditorPage type="page" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminRoute>
                  <AdminTaxonomyPage taxonomy="categories" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/tags"
              element={
                <AdminRoute>
                  <AdminTaxonomyPage taxonomy="tags" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/document-categories"
              element={
                <AdminRoute>
                  <AdminTaxonomyPage taxonomy="document-categories" />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/documents"
              element={
                <AdminRoute>
                  <AdminDocumentListPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/documents/new"
              element={
                <AdminRoute>
                  <AdminDocumentEditorPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/documents/:id"
              element={
                <AdminRoute>
                  <AdminDocumentDetailPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/documents/:id/edit"
              element={
                <AdminRoute>
                  <AdminDocumentEditorPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/posts/:id"
              element={
                <AdminRoute>
                  <AdminCmsDetailPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pages/:id"
              element={
                <AdminRoute>
                  <AdminCmsDetailPage />
                </AdminRoute>
              }
            />
            <Route path="/arsip" element={<ArsipPage />} />
            <Route path="/arsip/:category" element={<ArsipPage />} />
            <Route path="/ppid" element={<PpidPage />} />
            <Route
              path="/pusat-lppm/:slug"
              element={<SubBagianPage category="pusat-lppm" />}
            />
            <Route
              path="/administrasi/:slug"
              element={<SubBagianPage category="administrasi" />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
      </ApplicationFrame>
    </Router>
  );
}

export default App;
