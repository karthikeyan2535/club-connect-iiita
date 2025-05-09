import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { verifyEmail, sendVerificationEmail } from '../../services/auth';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [detailedError, setDetailedError] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmailToken = async () => {
      const emailParam = searchParams.get('email');
      const token = searchParams.get('token') || searchParams.get('type');
      
      console.log("Verification parameters:", { email: emailParam, token });
      setEmail(emailParam || '');

      if (!emailParam) {
        setStatus('error');
        setErrorMessage('Invalid verification link - missing email');
        setDetailedError('The verification link is missing required parameters. Please ensure you clicked the correct link from your email.');
        return;
      }
      
      // If token is missing, we just show the UI without attempting verification
      if (!token) {
        setStatus('error');
        setErrorMessage('Verification link is missing the token');
        setDetailedError('You can request a new verification email using the button below.');
        return;
      }
      
      console.log(`Attempting to verify email: ${emailParam} with token: ${token}`);

      try {
        const response = await verifyEmail(emailParam, token);
        console.log("Verification response:", response);
        
        if (response.success) {
          setStatus('success');
          toast({
            title: "Success",
            description: "Your email has been verified successfully",
          });
          sonnerToast.success("Email verified successfully!");
        } else {
          setStatus('error');
          setErrorMessage(response.message || 'Verification failed');
          setDetailedError('There was a problem verifying your email. This could be because the token has expired or was already used.');
          toast({
            title: "Verification failed",
            description: response.message,
            variant: "destructive",
          });
          sonnerToast.error(response.message);
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus('error');
        setErrorMessage('An error occurred during verification');
        setDetailedError('There was an unexpected error while processing your verification. Please try again or contact support.');
        toast({
          title: "Error",
          description: "An error occurred during verification",
          variant: "destructive",
        });
        sonnerToast.error("Verification failed");
      }
    };

    verifyEmailToken();
  }, [searchParams, toast]);

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide your email address to resend verification",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const response = await sendVerificationEmail(email);
      
      if (response.success) {
        toast({
          title: "Email Sent",
          description: "Verification email has been resent successfully",
        });
        sonnerToast.success("Verification email sent!");
      } else {
        toast({
          title: "Failed to Send",
          description: response.message || "Could not send verification email",
          variant: "destructive",
        });
        sonnerToast.error(response.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Email Verification</CardTitle>
            {status === 'error' && (
              <CardDescription className="text-red-500">
                {errorMessage}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="text-center py-6">
            {status === 'verifying' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-medium">Verifying your email</h3>
                <p className="text-gray-500">Please wait while we verify your email address...</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="text-xl font-medium">Email verified</h3>
                <p className="text-gray-500">Your email has been verified successfully. You can now log in to your account.</p>
                <Button 
                  onClick={() => navigate('/login')}
                  className="mt-6"
                >
                  Sign in
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <XCircle className="h-16 w-16 text-red-500" />
                </div>
                <h3 className="text-xl font-medium">Verification failed</h3>
                
                {detailedError && (
                  <Alert variant="destructive" className="text-left mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{detailedError}</AlertDescription>
                  </Alert>
                )}
                
                <p className="text-gray-500">There was a problem verifying your email.</p>
                
                {email && (
                  <div className="mt-4">
                    <Button 
                      onClick={handleResendVerification}
                      className="w-full"
                      disabled={isResending}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend verification email
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                <div className="pt-4">
                  <Link to="/login">
                    <Button variant="outline" className="mr-2">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button>
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="text-center text-gray-500 text-sm">
            <p className="w-full">
              Having issues? Contact 
              <a href="mailto:support@iiitaclubs.ac.in" className="text-primary hover:underline ml-1">
                support@iiitaclubs.ac.in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VerifyEmail;
