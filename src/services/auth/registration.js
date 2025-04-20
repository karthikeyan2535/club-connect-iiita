
import { supabase } from '../../integrations/supabase/client';

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
    
    // Enhanced error logging
    console.log('Creating user with metadata:', { full_name: name, user_role: role });
    
    // Sign up with Supabase, including metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          user_role: role
        },
        emailRedirectTo: `${window.location.origin}/verify-email`
      }
    });
    
    if (error) {
      console.error('Registration error from Supabase Auth:', error);
      
      // Enhanced error reporting with more context
      if (error.message.includes('Database error')) {
        console.error('⚠️ Database error detected. This might indicate a Supabase project configuration issue.');
        return { 
          success: false, 
          message: 'Unable to create account due to a database error. Please try again later or contact support.',
          error: error.message
        };
      }
      
      // More descriptive error messages based on common issues
      if (error.message.includes('already registered')) {
        return { success: false, message: 'This email is already registered. Please log in instead.' };
      }
      
      return { success: false, message: error.message };
    }
    
    console.log('User registration response:', data);
    
    if (!data.user) {
      return { success: false, message: 'Failed to create user' };
    }
    
    console.log('User created in auth system:', data.user.id);
    
    // Check if email confirmation is required
    if (data.session === null) {
      // Return verification link only for demo purposes
      const verificationLink = `/verify-email?email=${encodeURIComponent(email)}`;
      
      // Log verification email status to help with debugging
      console.log('⚠️ Verification email status:', 
        data.user.email_confirmed_at ? 'Already confirmed' : 'Confirmation pending');
      console.log('🔍 Check Supabase logs for email delivery status');
      
      return {
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
        verificationLink,
        verificationPending: true,
        userId: data.user.id
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
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }
};

// Verify email with improved error handling
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
      if (error.message.includes('expired')) {
        return { success: false, message: 'Verification link has expired. Please request a new one.' };
      }
      return { success: false, message: error.message };
    }
    
    console.log('Email verified successfully');
    return { success: true, message: 'Email verified successfully' };
  } catch (error) {
    console.error('Unexpected error during email verification:', error);
    return { success: false, message: 'An unexpected error occurred. Please try again.' };
  }
};

// Send verification email with improved error handling
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
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`
      }
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
    return { success: false, message: 'An unexpected error occurred. Please try again later.' };
  }
};
