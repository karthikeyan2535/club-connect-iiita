
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import MainLayout from '../../components/layout/MainLayout';
import { login } from '../../services/auth';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { supabase } from '../../integrations/supabase/client';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "../../components/ui/alert";
import { initializeDemoAccounts } from '../../seeds/demoAccounts';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // Initialize demo accounts when component mounts
  useEffect(() => {
    const setupDemoAccounts = async () => {
      try {
        await initializeDemoAccounts();
      } catch (error) {
        console.error("Error setting up demo accounts:", error);
      }
    };
    
    setupDemoAccounts();
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Checking auth status...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User is already logged in", session);
          
          // Extract user role from metadata or localStorage
          const userRole = session.user.user_metadata?.user_role || localStorage.getItem('userRole') || 'student';
          console.log("User role:", userRole);
          
          // Store role in localStorage
          localStorage.setItem('userRole', userRole);
          
          // Redirect to dashboard
          navigate(`/${userRole}/dashboard`);
        } else {
          console.log("User is not logged in");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    
    checkAuthStatus();
  }, [navigate]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };
    
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!email.endsWith('@iiita.ac.in')) {
      newErrors.email = 'Please use a valid IIITA email address';
      valid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
    
    // Clear any previous error
    setLoginError('');
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log(`Attempting to login with email: ${email} and role: ${role}`);
      const response = await login(email, password);
      console.log("Login response:", response);
      
      if (response.success) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.user.name || response.user.email.split('@')[0]}!`,
        });
        
        // Make sure user role is stored in localStorage
        const userRole = response.user.role || role;
        localStorage.setItem('userRole', userRole);
        
        console.log(`Redirecting to /${userRole}/dashboard`);
        
        // Redirect based on user role
        navigate(`/${userRole}/dashboard`);
      } else {
        console.error("Login failed:", response.message);
        setLoginError(response.message || 'Login failed. Please check your credentials.');
        
        toast({
          title: "Login failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError('An unexpected error occurred. Please try again.');
      
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold">Welcome back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>
            
            {loginError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Account Type</h3>
                <RadioGroup defaultValue="student" value={role} onValueChange={setRole} className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="cursor-pointer">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="organizer" id="organizer" />
                    <Label htmlFor="organizer" className="cursor-pointer">Club Organizer</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-lg font-medium block mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@iiita.ac.in"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: ''});
                    if (loginError) setLoginError('');
                  }}
                  className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="password" className="text-lg font-medium">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-primary hover:underline text-sm">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: ''});
                    if (loginError) setLoginError('');
                  }}
                  className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className="w-full py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : 'Sign in'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Quick login options for demo */}
        <div className="mt-8 max-w-md mx-auto bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Student:</strong> student@iiita.ac.in</p>
              <p><strong>Password:</strong> password123</p>
            </div>
            <div>
              <p><strong>Organizer:</strong> organizer@iiita.ac.in</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
