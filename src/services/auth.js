
// This is a mock service for authentication
// In a real application, this would connect to a backend

// Mock database of users
const users = [
  { id: 1, email: 'student@iiita.ac.in', password: 'password123', role: 'student', name: 'John Doe' },
  { id: 2, email: 'organizer@iiita.ac.in', password: 'password123', role: 'organizer', name: 'Jane Smith' }
];

// Mock OTP storage
const otpStore = {};

const generateOTP = (email) => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;
  
  console.log(`OTP for ${email}: ${otp}`); // In a real app, this would be sent via email
  
  return otp;
};

const verifyOTP = (email, otpInput) => {
  const storedOTP = otpStore[email];
  
  if (!storedOTP) {
    return { success: false, message: 'OTP expired or invalid' };
  }
  
  if (storedOTP === otpInput) {
    // Clear the OTP after successful verification
    delete otpStore[email];
    return { success: true, message: 'OTP verified successfully' };
  }
  
  return { success: false, message: 'Invalid OTP' };
};

export const sendVerificationOTP = (email) => {
  // Check if email exists and is valid
  if (!email || !email.endsWith('@iiita.ac.in')) {
    return { 
      success: false, 
      message: 'Please use a valid IIITA email address' 
    };
  }
  
  const user = users.find(u => u.email === email);
  if (!user) {
    // In a real app, you might want to handle this differently
    // Here we're allowing unregistered users to request OTP for signup
    generateOTP(email);
    return { 
      success: true, 
      message: 'If this email exists, an OTP has been sent' 
    };
  }
  
  // Generate and store OTP
  generateOTP(email);
  
  return { 
    success: true, 
    message: 'OTP has been sent to your email' 
  };
};

export const login = (email, password) => {
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  
  if (user.password !== password) {
    return { success: false, message: 'Invalid password' };
  }
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = user;
  
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
  // Check if email exists
  const userExists = users.find(u => u.email === email);
  
  if (userExists) {
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
  
  // Don't return password in response
  const { password: _, ...userWithoutPassword } = newUser;
  
  return { 
    success: true, 
    message: 'Registration successful', 
    user: userWithoutPassword 
  };
};
