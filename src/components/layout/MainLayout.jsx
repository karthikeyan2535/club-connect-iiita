
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const MainLayout = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in on component mount
    const storedUserRole = localStorage.getItem('userRole');
    const storedUser = localStorage.getItem('user');
    
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        // Clear corrupted user data
        localStorage.removeItem('user');
      }
    }
    
    // Function to handle storage changes
    const handleStorageChange = () => {
      const updatedUserRole = localStorage.getItem('userRole');
      const updatedUser = localStorage.getItem('user');
      
      setUserRole(updatedUserRole || null);
      
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    
    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);
    
    // Create a custom event listener for this tab
    window.addEventListener('localStorageChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUserRole(null);
    setUser(null);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('localStorageChange'));
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    // Redirect to homepage after logout
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary py-3 px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary-foreground flex items-center">
          <span className="text-[#1e40af] bg-white px-2 py-1 rounded mr-2">IIITA</span> 
          <span className="text-white">ClubHub</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-white/80">
            Home
          </Link>
          <Link to="/clubs" className="text-white hover:text-white/80">
            Clubs
          </Link>
          <Link to="/events" className="text-white hover:text-white/80">
            Events
          </Link>
          <Link to="/about" className="text-white hover:text-white/80">
            About
          </Link>
          {userRole && (
            <Link 
              to={userRole === 'student' ? '/student/dashboard' : '/organizer/dashboard'}
              className="text-white hover:text-white/80"
            >
              Dashboard
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {!userRole ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-white/80 flex items-center gap-2">
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Log in</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="bg-white text-primary hover:bg-white/90 flex items-center gap-2">
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Register</span>
                </Button>
              </Link>
            </>
          ) : (
            <Button 
              variant="ghost" 
              className="text-white hover:text-white/80"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
      <Navbar userRole={userRole} user={user} onLogout={handleLogout} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
