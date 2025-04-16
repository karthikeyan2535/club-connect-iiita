
import { supabase } from '../../integrations/supabase/client';

// Send OTP for verification
export const sendVerificationOTP = async (email) => {
  console.log(`Sending verification OTP to ${email}`);
  
  if (!email) {
    return { 
      success: false, 
      message: 'Email is required' 
    };
  }
  
  try {
    // Generate a 6-digit OTP (for demo purposes)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real application, this would be stored securely and sent via email
    // For demo purposes, we'll return it directly
    console.log('Generated OTP:', otp);
    
    // Store OTP in localStorage for demo verification (in production, this would be on server)
    localStorage.setItem(`otp_${email}`, JSON.stringify({
      code: otp,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    }));
    
    return { 
      success: true, 
      message: 'OTP has been sent to your email.',
      otp: otp // For demo purposes only, remove in production
    };
  } catch (error) {
    console.error('Error sending verification OTP:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Verify OTP for email verification
export const verifyEmailOTP = async (email, otp) => {
  console.log(`Verifying OTP ${otp} for ${email}`);
  
  if (!email || !otp) {
    return { 
      success: false, 
      message: 'Email and OTP are required' 
    };
  }
  
  try {
    // Retrieve stored OTP from localStorage (for demo purposes)
    const storedOTPData = localStorage.getItem(`otp_${email}`);
    
    if (!storedOTPData) {
      return { success: false, message: 'OTP has expired or was never sent' };
    }
    
    const { code, expires } = JSON.parse(storedOTPData);
    
    // Check if OTP has expired
    if (Date.now() > expires) {
      localStorage.removeItem(`otp_${email}`);
      return { success: false, message: 'OTP has expired' };
    }
    
    // Check if OTP matches
    if (otp !== code) {
      return { success: false, message: 'Invalid OTP' };
    }
    
    // Clear the OTP after successful verification
    localStorage.removeItem(`otp_${email}`);
    
    return { success: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
