
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ClubsPage from "./pages/clubs/ClubsPage";
import ClubDetails from "./pages/clubs/ClubDetails";
import EventsPage from "./pages/events/EventsPage";
import EventDetails from "./pages/events/EventDetails";
import StudentDashboard from "./pages/student/Dashboard";
import OrganizerDashboard from "./pages/organizer/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children, allowedRole }: { children: JSX.Element, allowedRole: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCorrectRole, setHasCorrectRole] = useState(false);
  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedUserRole = localStorage.getItem('userRole');
      
      const authenticated = !!storedUser && !!storedUserRole;
      const correctRole = storedUserRole === allowedRole;
      
      console.log("Auth check:", { authenticated, correctRole, storedUserRole, allowedRole });
      
      setIsAuthenticated(authenticated);
      setHasCorrectRole(correctRole);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
      setHasCorrectRole(false);
    } finally {
      setIsLoading(false);
    }
  }, [allowedRole]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  if (!hasCorrectRole) {
    console.log("Wrong role, redirecting to home");
    return <Navigate to="/" />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Club Routes */}
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          
          {/* Event Routes */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          
          {/* Organizer Routes */}
          <Route path="/organizer/dashboard" element={
            <ProtectedRoute allowedRole="organizer">
              <OrganizerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
