
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
      (event, session) => {
        console.log('Auth state changed:', event, session ? 'User is logged in' : 'User is logged out');
        
        if (session) {
          // Use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            try {
              // Get user profile from profiles table
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (profileError) {
                console.error('Profile fetch error:', profileError);
                return;
              }
              
              const userWithProfile = {
                ...session.user,
                name: profileData?.full_name || session.user.email.split('@')[0],
                role: profileData?.user_role || 'student'
              };
              
              console.log('User authenticated:', userWithProfile);
              setUser(userWithProfile);
              setUserRole(profileData?.user_role || 'student');
              
              // Store in localStorage as backup
              localStorage.setItem('user', JSON.stringify(userWithProfile));
              localStorage.setItem('userRole', profileData?.user_role || 'student');
            } catch (error) {
              console.error('Error setting user data:', error);
            }
          }, 0);
        } else {
          console.log('User is logged out, clearing state');
          setUser(null);
          setUserRole(null);
          
          // Clear localStorage
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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('Error getting user profile:', profileError);
            setIsInitialized(true);
            return;
          }
          
          const userWithProfile = {
            ...session.user,
            name: profileData?.full_name || session.user.email.split('@')[0],
            role: profileData?.user_role || 'student'
          };
          
          setUser(userWithProfile);
          setUserRole(profileData?.user_role || 'student');
          
          // Store in localStorage as backup
          localStorage.setItem('user', JSON.stringify(userWithProfile));
          localStorage.setItem('userRole', profileData?.user_role || 'student');
        } else {
          // Check localStorage as fallback
          const storedUserRole = localStorage.getItem('userRole');
          const storedUser = localStorage.getItem('user');
          
          if (storedUser && storedUserRole) {
            try {
              const parsedUser = JSON.parse(storedUser);
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
