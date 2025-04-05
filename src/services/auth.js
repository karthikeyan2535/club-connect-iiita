
// This is a mock service for authentication
// In a real application, this would connect to a backend

// Mock database of users
const users = [
  { id: 1, email: 'student@iiita.ac.in', password: 'password123', role: 'student', name: 'John Doe', emailVerified: true },
  { id: 2, email: 'organizer@iiita.ac.in', password: 'password123', role: 'organizer', name: 'Jane Smith', emailVerified: true }
];

// Mock email verification tokens with expiration
const emailVerificationTokens = {};

// Mock OTP storage
const otpStore = {};

const generateEmailVerificationToken = (email) => {
  // Generate a random token (in a real app, this would be a cryptographically secure token)
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Store token with expiration (24 hours)
  emailVerificationTokens[email] = {
    token: token,
    expiry: Date.now() + 24 * 60 * 60 * 1000
  };
  
  console.log(`Verification token generated for ${email}: ${token}`); // In a real app, this would be sent via email
  
  return token;
};

export const sendVerificationEmail = (email) => {
  console.log(`Sending verification email to ${email}`);
  
  // Check if email exists and is valid
  if (!email) {
    return { 
      success: false, 
      message: 'Email is required' 
    };
  }
  
  if (!email.endsWith('@iiita.ac.in')) {
    return { 
      success: false, 
      message: 'Please use a valid IIITA email address' 
    };
  }
  
  // Generate and store verification token
  const token = generateEmailVerificationToken(email);
  
  // In a real app, this is where an email would be sent
  console.log(`Email sent to ${email} with verification link: /verify-email?email=${email}&token=${token}`);
  
  return { 
    success: true, 
    message: 'Verification email has been sent. Please check your inbox.',
    // For demo purposes - in a real app, this would be sent via email
    verificationLink: `/verify-email?email=${email}&token=${token}`
  };
};

export const verifyEmail = (email, token) => {
  console.log(`Verifying email for ${email} with token: ${token}`);
  
  const storedVerification = emailVerificationTokens[email];
  
  if (!storedVerification) {
    console.log('No verification token found for this email');
    return { success: false, message: 'Invalid or expired verification link' };
  }
  
  if (Date.now() > storedVerification.expiry) {
    console.log('Verification token expired');
    delete emailVerificationTokens[email];
    return { success: false, message: 'Verification link has expired' };
  }
  
  if (storedVerification.token === token) {
    console.log('Email verified successfully');
    delete emailVerificationTokens[email];
    
    // Find pending user registration and mark email as verified
    const pendingUser = users.find(u => u.email === email && !u.emailVerified);
    if (pendingUser) {
      pendingUser.emailVerified = true;
      console.log(`Email verified for user: ${pendingUser.name}`);
    }
    
    return { success: true, message: 'Email verified successfully' };
  }
  
  console.log('Invalid verification token');
  return { success: false, message: 'Invalid verification link' };
};

export const login = (email, password) => {
  console.log(`Login attempt for ${email}`);
  
  if (!email || !password) {
    return { 
      success: false, 
      message: 'Email and password are required' 
    };
  }
  
  if (!email.endsWith('@iiita.ac.in')) {
    return { 
      success: false, 
      message: 'Please use a valid IIITA email address' 
    };
  }
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found');
    return { success: false, message: 'User not found' };
  }
  
  if (user.password !== password) {
    console.log('Invalid password');
    return { success: false, message: 'Invalid password' };
  }
  
  if (!user.emailVerified) {
    console.log('Email not verified');
    return { 
      success: false, 
      message: 'Please verify your email before logging in',
      pendingVerification: true 
    };
  }
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;
  
  console.log('Login successful for', userWithoutPassword.name);
  return { 
    success: true, 
    message: 'Login successful', 
    user: userWithoutPassword 
  };
};

export const register = (email, password, name, role) => {
  console.log(`Registration attempt for ${email} as ${role}`);
  
  // Check required fields
  if (!email || !password || !name || !role) {
    return { 
      success: false, 
      message: 'All fields are required' 
    };
  }
  
  // Validate email format
  if (!email.endsWith('@iiita.ac.in')) {
    return { 
      success: false, 
      message: 'Please use a valid IIITA email address' 
    };
  }
  
  // Check if email exists
  const userExists = users.find(u => u.email === email);
  
  if (userExists) {
    console.log('User already exists');
    return { success: false, message: 'User with this email already exists' };
  }
  
  // Create new user (but not verified yet)
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    role,
    emailVerified: false // Email not verified yet
  };
  
  // In a real app, this would be saved to a database
  users.push(newUser);
  console.log('New user registered (pending verification):', newUser.email);
  
  // Generate verification token and "send" verification email
  const verificationResponse = sendVerificationEmail(email);
  
  return { 
    success: true, 
    message: 'Registration successful. Please check your email to verify your account.', 
    verificationLink: verificationResponse.verificationLink // For demo purposes only
  };
};

// Helper function to check if user exists (for development/demo)
export const getUserByEmail = (email) => {
  return users.find(u => u.email === email);
};

// Reset password functionality
export const resetPassword = (email, newPassword) => {
  console.log(`Password reset attempt for ${email}`);
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found');
    return { success: false, message: 'User not found' };
  }
  
  // Update password
  user.password = newPassword;
  console.log('Password updated for:', email);
  
  return {
    success: true,
    message: 'Password reset successful'
  };
};

// Function for resending verification email
export const resendVerificationEmail = (email) => {
  console.log(`Resending verification email to ${email}`);
  
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found');
    return { success: false, message: 'User not found' };
  }
  
  if (user.emailVerified) {
    console.log('Email already verified');
    return { success: false, message: 'Email already verified' };
  }
  
  return sendVerificationEmail(email);
};

// New OTP-related functions
export const sendVerificationOTP = (email) => {
  console.log(`Sending verification OTP to ${email}`);
  
  if (!email) {
    return { 
      success: false, 
      message: 'Email is required' 
    };
  }
  
  if (!email.endsWith('@iiita.ac.in')) {
    return { 
      success: false, 
      message: 'Please use a valid IIITA email address' 
    };
  }
  
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP with expiration (10 minutes)
  otpStore[email] = {
    otp: otp,
    expiry: Date.now() + 10 * 60 * 1000 // 10 minutes
  };
  
  console.log(`OTP sent to ${email}: ${otp}`); // In a real app, this would be sent via email
  
  return { 
    success: true, 
    message: 'Verification code has been sent to your email',
    otp: otp // For demo purposes only - in a real app, this would be sent via email
  };
};

export const verifyEmailOTP = (email, otp) => {
  console.log(`Verifying OTP for ${email}: ${otp}`);
  
  const storedOTP = otpStore[email];
  
  if (!storedOTP) {
    console.log('No OTP found for this email');
    return { success: false, message: 'Invalid or expired verification code' };
  }
  
  if (Date.now() > storedOTP.expiry) {
    console.log('OTP expired');
    delete otpStore[email];
    return { success: false, message: 'Verification code has expired' };
  }
  
  if (storedOTP.otp === otp) {
    console.log('OTP verified successfully');
    delete otpStore[email];
    
    return { success: true, message: 'Email verified successfully' };
  }
  
  console.log('Invalid OTP');
  return { success: false, message: 'Invalid verification code' };
};
