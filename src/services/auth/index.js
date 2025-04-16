
// Main auth service index file that exports all auth-related functions

import { login, getCurrentUser, signOut } from './core';
import { register, verifyEmail, sendVerificationEmail } from './registration';
import { resetPassword, sendPasswordResetEmail } from './password';
import { sendVerificationOTP, verifyEmailOTP } from './verification';

export {
  // Core authentication functions
  login,
  getCurrentUser,
  signOut,
  
  // Registration functions
  register,
  verifyEmail,
  sendVerificationEmail,
  
  // Password management
  resetPassword,
  sendPasswordResetEmail,
  
  // OTP verification
  sendVerificationOTP,
  verifyEmailOTP
};
