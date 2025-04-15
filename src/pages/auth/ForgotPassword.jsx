
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import MainLayout from '../../components/layout/MainLayout';
import OTPInput from '../../components/auth/OTPInput';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Eye, EyeOff, Mail, ArrowLeft } from 'lucide-react';
import { sendVerificationOTP, verifyEmailOTP, resetPassword } from '../../services/auth';

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpResendTime, setOtpResendTime] = useState(0);

  // Handle OTP resend timer
  React.useEffect(() => {
    let timer;
    if (otpSent && otpResendTime > 0) {
      timer = setTimeout(() => {
        setOtpResendTime(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, otpResendTime]);

  const validateEmail = (email) => {
    return email && email.endsWith('@iiita.ac.in');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
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
        sonnerToast.success("OTP sent successfully!");
        setOtpSent(true);
        setOtpResendTime(60); // Set resend timer to 60 seconds
        
        // For demo purposes only - this would be removed in production
        if (response.otp) {
          console.log("Demo OTP:", response.otp);
        }
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        sonnerToast.error(response.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
      sonnerToast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await verifyEmailOTP(email, otp);
      console.log("OTP verification response:", response);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Email verified successfully",
        });
        sonnerToast.success("Email verified successfully!");
        setOtpVerified(true);
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        sonnerToast.error(response.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
      sonnerToast.error("Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
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
      // Use the resetPassword service function
      const response = await resetPassword(email, password);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Your password has been reset successfully",
        });
        sonnerToast.success("Password reset successful!");
        
        // Redirect to login page
        navigate('/login');
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        sonnerToast.error(response.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
      sonnerToast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold">Reset Password</h2>
              <p className="text-gray-600 mt-2">Get back into your account</p>
            </div>
            
            {!otpSent ? (
              // Step 1: Enter Email
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="text-lg font-medium block mb-2">
                    Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@iiita.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter your IIITA email address to receive a verification code
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-6 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                </Button>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="text-primary hover:underline flex items-center justify-center gap-2">
                    <ArrowLeft size={16} />
                    <span>Back to Login</span>
                  </Link>
                </div>
              </form>
            ) : !otpVerified ? (
              // Step 2: Enter OTP
              <div className="space-y-6">
                <p className="text-center text-gray-600">
                  Enter the 6-digit code sent to <span className="font-medium">{email}</span>
                </p>
                
                <div className="mb-6 py-4">
                  <OTPInput length={6} onComplete={handleVerifyOTP} />
                </div>
                
                <div className="text-sm text-center space-x-3">
                  <button
                    onClick={() => setOtpSent(false)}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                    type="button"
                  >
                    Change email
                  </button>
                  <span>|</span>
                  {otpResendTime > 0 ? (
                    <span className="text-gray-500">
                      Resend OTP in {otpResendTime}s
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        handleSendOTP({ preventDefault: () => {} });
                      }}
                      className="text-primary hover:underline"
                      disabled={isLoading}
                      type="button"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Step 3: Set New Password
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <Label htmlFor="new-password" className="text-lg font-medium block mb-2">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-lg font-medium block mb-2">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div className="mt-1 flex items-center">
                      {password === confirmPassword ? (
                        <span className="text-xs text-green-500">Passwords match</span>
                      ) : (
                        <span className="text-xs text-red-500">Passwords do not match</span>
                      )}
                    </div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-6 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
