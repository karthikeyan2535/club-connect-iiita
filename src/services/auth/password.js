
import { supabase } from '../integrations/supabase/client';

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
