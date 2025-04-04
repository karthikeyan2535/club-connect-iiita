
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { verifyEmail } from '../../services/auth';
import MainLayout from '../../components/layout/MainLayout';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmailToken = async () => {
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      if (!email || !token) {
        setStatus('error');
        setErrorMessage('Invalid verification link');
        return;
      }

      try {
        const response = await verifyEmail(email, token);
        
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Email Verification</CardTitle>
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
                <p className="text-gray-500">{errorMessage || 'There was a problem verifying your email.'}</p>
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
