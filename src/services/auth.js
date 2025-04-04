
// This is a mock service for authentication
// In a real application, this would connect to a backend

// Mock database of users
const users = [
  { id: 1, email: 'student@iiita.ac.in', password: 'password123', role: 'student', name: 'John Doe' },
  { id: 2, email: 'organizer@iiita.ac.in', password: 'password123', role: 'organizer', name: 'Jane Smith' }
];

// Mock OTP storage with expiration
const otpStore = {};

const generateOTP = (email) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP with expiration (10 minutes)
  otpStore[email] = {
    code: otp,
    expiry: Date.now() + 10 * 60 * 1000
  };
  
  console.log(`OTP generated for ${email}: ${otp}`); // In a real app, this would be sent via email
  
  return otp;
};

const verifyOTP = (email, otpInput) => {
  console.log(`Verifying OTP for ${email}:`, otpInput);
  console.log('Current OTP store:', otpStore);
  
  const storedOTP = otpStore[email];
  
  if (!storedOTP) {
    console.log('No OTP found for this email');
    return { success: false, message: 'OTP expired or invalid' };
  }
  
  if (Date.now() > storedOTP.expiry) {
    console.log('OTP expired');
    delete otpStore[email];
    return { success: false, message: 'OTP has expired' };
  }
  
  if (storedOTP.code === otpInput) {
    // Clear the OTP after successful verification
    console.log('OTP verified successfully');
    delete otpStore[email];
    return { success: true, message: 'OTP verified successfully' };
  }
  
  console.log('Invalid OTP');
  return { success: false, message: 'Invalid OTP' };
};

export const sendVerificationOTP = (email) => {
  console.log(`Sending verification OTP to ${email}`);
  
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
  
  // Generate and store OTP
  const otp = generateOTP(email);
  
  return { 
    success: true, 
    message: 'OTP has been sent to your email',
    otp: otp // For demo purposes only - in a real app, this would be sent via email
  };
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
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;
  
  console.log('Login successful for', userWithoutPassword.name);
  return { 
    success: true, 
    message: 'Login successful', 
    user: userWithoutPassword 
  };
};

export const verifyEmailOTP = (email, otp) => {
  return verifyOTP(email, otp);
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
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    role
  };
  
  // In a real app, this would be saved to a database
  users.push(newUser);
  console.log('New user registered:', newUser.email);
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = newUser;
  
  return { 
    success: true, 
    message: 'Registration successful', 
    user: userWithoutPassword 
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
