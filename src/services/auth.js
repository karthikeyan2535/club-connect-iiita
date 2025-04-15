
import { supabase } from '../integrations/supabase/client';

// Login with email and password
export const login = async (email, password) => {
  console.log(`Login attempt for ${email}`);
  
  if (!email || !password) {
    return { 
      success: false, 
      message: 'Email and password are required' 
    };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.log('Login error:', error.message);
      return { success: false, message: error.message };
    }
    
    // Get additional user profile data (role, name, etc.)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.log('Profile fetch error:', profileError.message);
      return { success: true, message: 'Login successful but failed to fetch profile', user: data.user };
    }
    
    // Combine auth data with profile data
    const userWithProfile = {
      ...data.user,
      name: profileData.full_name,
      role: profileData.user_role
    };
    
    console.log('Login successful for', userWithProfile.name);
    return { 
      success: true, 
      message: 'Login successful', 
      user: userWithProfile
    };
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

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
    // Create the user in Supabase Auth
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
      console.log('Registration error:', error.message);
      return { success: false, message: error.message };
    }
    
    console.log('New user registered:', data.user.email);
    
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
      // User was auto-confirmed
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

// Reset password functionality
export const resetPassword = async (email, newPassword) => {
  console.log(`Password reset attempt for ${email}`);
  
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.log('Password reset error:', error.message);
      return { success: false, message: error.message };
    }
    
    console.log('Password updated for:', email);
    
    return {
      success: true,
      message: 'Password reset successful'
    };
  } catch (error) {
    console.error('Unexpected error during password reset:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email) => {
  console.log(`Sending password reset email to ${email}`);
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    
    if (error) {
      console.log('Password reset email error:', error.message);
      return { success: false, message: error.message };
    }
    
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email'
    };
  } catch (error) {
    console.error('Unexpected error when sending password reset email:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

// Helper functions for session management
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    
    if (!session) {
      return null;
    }
    
    // Get additional user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error getting user profile:', profileError.message);
      return session.user;
    }
    
    // Combine auth user with profile data
    if (profileData) {
      return {
        ...session.user,
        name: profileData.full_name,
        role: profileData.user_role
      };
    }
    
    return session.user;
  } catch (error) {
    console.error('Unexpected error when getting current user:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error.message);
      return { success: false, message: error.message };
    }
    
    return { success: true, message: 'Signed out successfully' };
  } catch (error) {
    console.error('Unexpected error when signing out:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};
