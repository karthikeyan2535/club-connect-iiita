
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import MainLayout from '../../components/layout/MainLayout';
import OTPInput from '../../components/auth/OTPInput';
import { sendVerificationOTP, verifyEmailOTP, register } from '../../services/auth';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
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

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password should be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await register(email, password, name, role);
      
      if (response.success) {
        // Save user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('userRole', response.user.role);
        
        toast({
          title: "Registration successful",
          description: `Welcome to IIITA Club Connect, ${response.user.name}!`,
        });
        
        // Redirect based on user role
        if (response.user.role === 'organizer') {
          navigate('/organizer/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        toast({
          title: "Registration failed",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
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
            <h2 className="text-2xl font-bold">Register</h2>
            <p className="text-sm">Create your IIITA Club Connect account</p>
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
                  <p className="mt-1 text-xs text-gray-500">
                    Must be a valid IIITA email address
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="student"
                        checked={role === 'student'}
                        onChange={() => setRole('student')}
                        className="mr-1"
                      />
                      <span>Student</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="organizer"
                        checked={role === 'organizer'}
                        onChange={() => setRole('organizer')}
                        className="mr-1"
                      />
                      <span>Club Organizer</span>
                    </label>
                  </div>
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
              // Step 3: Complete Registration
              <form onSubmit={handleRegister}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            )}
            
            <div className="mt-6 text-sm text-center">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Register;
