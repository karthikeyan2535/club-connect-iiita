import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { getCurrentUser, signOut } from '../../services/auth';

const MainLayout = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'User is logged in' : 'User is logged out');
        
        if (session) {
          try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
              console.log('User authenticated:', currentUser);
              setUser(currentUser);
              setUserRole(currentUser.role || 'student'); // Default to student if role is missing
              
              // Also store in localStorage as backup
              localStorage.setItem('user', JSON.stringify(currentUser));
              localStorage.setItem('userRole', currentUser.role || 'student');
            }
          } catch (error) {
            console.error('Error setting user data:', error);
          }
        } else {
          console.log('User is logged out, clearing state');
          setUser(null);
          setUserRole(null);
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
        }
        
        setIsInitialized(true);
      }
    );
    
    // Check for existing session on component mount
    const initializeAuth = async () => {
      try {
        // Try to get current user from Supabase
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          console.log('Existing user found:', currentUser);
          setUser(currentUser);
          setUserRole(currentUser.role || 'student');
          
          // Also store in localStorage as backup
          localStorage.setItem('user', JSON.stringify(currentUser));
          localStorage.setItem('userRole', currentUser.role || 'student');
        } else {
          console.log('No authenticated user found');
          // Check localStorage as fallback
          const storedUserRole = localStorage.getItem('userRole');
          const storedUser = localStorage.getItem('user');
          
          if (storedUser && storedUserRole) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log('Using stored user data:', parsedUser);
              setUser(parsedUser);
              setUserRole(storedUserRole);
            } catch (error) {
              console.error('Error parsing stored user data:', error);
              localStorage.removeItem('user');
              localStorage.removeItem('userRole');
            }
          } else {
            setUser(null);
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
    
    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    console.log("Logout initiated");
    
    try {
      const result = await signOut();
      
      if (result.success) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
        
        // Navigate to homepage after logout
        navigate('/');
      } else {
        toast({
          title: "Logout failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Error",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  if (!isInitialized) {
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
