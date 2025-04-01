
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import MainLayout from '../../components/layout/MainLayout';
import OTPInput from '../../components/auth/OTPInput';
import { sendVerificationOTP, verifyEmailOTP, login } from '../../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email || !email.endsWith('@iiita.ac.in')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid IIITA email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await sendVerificationOTP(email);
      
      if (response.success) {
        toast({
          title: "OTP Sent",
          description: response.message,
        });
        setOtpSent(true);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setIsLoading(true);
    
    try {
      const response = await verifyEmailOTP(email, otp);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Email verified successfully",
        });
        setOtpVerified(true);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await login(email, password);
      
      if (response.success) {
        // Save user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userRole', response.user.role);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.user.name}!`,
        });
        
        // Redirect based on user role
        if (response.user.role === 'organizer') {
          navigate('/organizer/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        toast({
          title: "Login failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
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
          <div className="py-4 px-6 bg-primary text-primary-foreground text-center">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-sm">Access your IIITA Club Connect account</p>
          </div>
          
          <div className="p-6">
            {!otpSent ? (
              // Step 1: Enter Email
              <form onSubmit={handleSendOTP}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your.name@iiita.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : !otpVerified ? (
              // Step 2: Enter OTP
              <div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Enter the OTP sent to {email}
                </p>
                
                <div className="mb-6">
                  <OTPInput length={6} onComplete={handleVerifyOTP} />
                </div>
                
                <div className="text-sm text-center">
                  <button
                    onClick={() => setOtpSent(false)}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Change email
                  </button>
                  {' | '}
                  <button
                    onClick={() => handleSendOTP({ preventDefault: () => {} })}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            ) : (
              // Step 3: Enter Password
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            )}
            
            <div className="mt-6 text-sm text-center">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
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
