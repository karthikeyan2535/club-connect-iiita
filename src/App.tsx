
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ClubsPage from "./pages/clubs/ClubsPage";
import ClubDetails from "./pages/clubs/ClubDetails";
import EventsPage from "./pages/events/EventsPage";
import EventDetails from "./pages/events/EventDetails";
import StudentDashboard from "./pages/student/Dashboard";
import OrganizerDashboard from "./pages/organizer/Dashboard";

const queryClient = new QueryClient();

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
          
          {/* Club Routes */}
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          
          {/* Event Routes */}
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          
          {/* Organizer Routes */}
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
