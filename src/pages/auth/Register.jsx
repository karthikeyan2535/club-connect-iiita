
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Checkbox } from '../../components/ui/checkbox';
import { Eye, EyeOff, User, Mail, Check, X, Loader2, Info } from 'lucide-react';
import { register, sendVerificationEmail } from '../../services/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [verificationLink, setVerificationLink] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/organizer/dashboard');
      }
    }
  }, [navigate]);

  const validateEmail = (email) => {
    return email && email.endsWith('@iiita.ac.in');
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    
    // Form validation
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid IIITA email address",
        variant: "destructive",
      });
      return;
    }
    
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
    
    if (!agreedToTerms) {
      toast({
        title: "Terms and Conditions",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting registration with:", { email, name, role });
      const response = await register(email, password, name, role);
      console.log("Registration response:", response);
      
      if (response.success) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account",
        });
        
        sonnerToast.success("Registration successful! Please verify your email.");
        
        setRegistrationComplete(true);
        
        // For demo purposes - in a real app, this would be hidden
        if (response.verificationLink) {
          setVerificationLink(response.verificationLink);
          console.log(`✉️ DEMO: Verification link for ${email}: ${response.verificationLink}`);
        }
      } else {
        setRegistrationError(response.message);
        toast({
          title: "Registration failed",
          description: response.message,
          variant: "destructive",
        });
        sonnerToast.error(response.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setRegistrationError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
      sonnerToast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  const resendVerificationEmail = async () => {
    setIsLoading(true);
    
    try {
      const response = await sendVerificationEmail(email);
      
      if (response.success) {
        toast({
          title: "Email sent",
          description: "Verification email has been resent",
        });
        
        sonnerToast.success("Verification email sent. Please check your inbox.");
        
        // For demo purposes - in a real app, this would be hidden
        if (response.verificationLink) {
          setVerificationLink(response.verificationLink);
          console.log(`✉️ DEMO: Resent verification link for ${email}: ${response.verificationLink}`);
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
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        variant: "destructive",
      });
      sonnerToast.error("Failed to send verification email");
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
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
            <CardDescription>Join the IIITA clubs platform</CardDescription>
          </CardHeader>
          
          <CardContent>
            {registrationError && (
              <Alert variant="destructive" className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Registration Error</AlertTitle>
                <AlertDescription>{registrationError}</AlertDescription>
              </Alert>
            )}
            
            {!registrationComplete ? (
              // Registration Form
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Type</h3>
                  <RadioGroup defaultValue="student" value={role} onValueChange={setRole} className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="r-student" />
                      <Label htmlFor="r-student" className="cursor-pointer">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="organizer" id="r-organizer" />
                      <Label htmlFor="r-organizer" className="cursor-pointer">Club Organizer</Label>
                    </div>
                  </RadioGroup>
                </div>
                
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
                    Must be a valid IIITA email address
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="name" className="text-lg font-medium block mb-2">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10"
                      required
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password" className="text-lg font-medium block mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
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
                        <>
                          <Check size={16} className="text-green-500 mr-1" />
                          <span className="text-xs text-green-500">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <X size={16} className="text-red-500 mr-1" />
                          <span className="text-xs text-red-500">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={setAgreedToTerms}
                  />
                  <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      terms and conditions
                    </Link>
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-6 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </Button>
              </form>
            ) : (
              // Email Verification Message
              <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                
                <h3 className="text-xl font-bold">Verify your email</h3>
                
                <p className="text-gray-600">
                  We've sent a verification link to{" "}
                  <span className="font-medium">{email}</span>
                </p>
                
                <p className="text-sm text-gray-500">
                  Please check your inbox and click on the verification link to complete your registration.
                </p>
                
                {/* For demo purposes only - in a real app this would be removed */}
                {verificationLink && (
                  <div className="border border-dashed border-gray-300 p-4 rounded-md bg-gray-50 text-left">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Demo: Click the link below to verify</p>
                    <Link 
                      to={verificationLink} 
                      className="text-sm text-primary underline break-all"
                    >
                      {verificationLink}
                    </Link>
                  </div>
                )}
                
                <div className="pt-4">
                  <Button
                    onClick={resendVerificationEmail}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : 'Resend verification email'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <p className="w-full text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Register;
