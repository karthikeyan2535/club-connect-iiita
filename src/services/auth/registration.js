
import { supabase } from '../integrations/supabase/client';

// Register a new user
export const register = async (email, password, name, role) => {
  console.log(`Registration attempt for ${email} as ${role}`);
  
  // Check required fields
  if (!email || !password || !name || !role) {
    return { 
      success: false, 
      message: 'All fields are required' 
    };
  }
  
  try {
    // Validate role before proceeding
    if (!['student', 'organizer', 'admin'].includes(role)) {
      console.log('Invalid role format:', role);
      return { success: false, message: 'Invalid user role format' };
    }
    
    // Step 1: Create the user in Supabase Auth with user_role in metadata
    console.log('Creating user with metadata:', { full_name: name, user_role: role });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          user_role: role
        }
      }
    });
    
    if (error) {
      console.error('Registration error from Supabase Auth:', error);
      return { success: false, message: error.message };
    }
    
    console.log('User created in auth system:', data.user?.id);
    
    // Check if email confirmation is required
    if (data.session === null) {
      // Return verification link only for demo purposes
      const verificationLink = `/verify-email?email=${encodeURIComponent(email)}`;
      
      return {
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        verificationLink
      };
    } else {
      // User was auto-confirmed - set the user role in localStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('user', JSON.stringify({
        ...data.user,
        name: name,
        role: role
      }));
      
      return {
        success: true,
        message: 'Registration successful. You can now log in.',
        user: data.user
      };
    }
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Verify email
export const verifyEmail = async (email, token) => {
  console.log(`Verifying email for ${email} with token: ${token}`);
  
  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup'
    });
    
    if (error) {
      console.log('Email verification error:', error.message);
      return { success: false, message: error.message };
    }
    
    console.log('Email verified successfully');
    return { success: true, message: 'Email verified successfully' };
  } catch (error) {
    console.error('Unexpected error during email verification:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Send verification email
export const sendVerificationEmail = async (email) => {
  console.log(`Sending verification email to ${email}`);
  
  if (!email) {
    return { 
      success: false, 
      message: 'Email is required' 
    };
  }
  
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    });
    
    if (error) {
      console.log('Resend verification error:', error.message);
      return { success: false, message: error.message };
    }
    
    console.log('Verification email sent successfully');
    
    // For demo purposes only - in a real app, this would be sent via email
    const verificationLink = `/verify-email?email=${encodeURIComponent(email)}`;
    
    return { 
      success: true, 
      message: 'Verification email has been sent. Please check your inbox.',
      verificationLink
    };
  } catch (error) {
    console.error('Unexpected error when sending verification email:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
