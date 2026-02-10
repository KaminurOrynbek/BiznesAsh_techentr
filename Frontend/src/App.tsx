import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

import { Toaster } from "react-hot-toast";
import { ProtectedRoute, NotificationWatcher } from "./components";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  FeedPage,
  PostDetailPage,
  NotificationsPage,
  HandbookPage,
  ProfilePage,
  SubscriptionPage,
  ExpertListingPage,
  VerifyEmailPage,
} from "./pages";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <NotificationWatcher />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Public (or make protected if you want) */}
          <Route path="/handbook" element={<HandbookPage />} />

          {/* Protected */}
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <FeedPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post/:postId"
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* If your Profile page is not user-specific, change to "/profile" */}
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute>
                <SubscriptionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/experts"
            element={
              <ProtectedRoute>
                <ExpertListingPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
