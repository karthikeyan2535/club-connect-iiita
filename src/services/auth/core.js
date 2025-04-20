import { supabase } from '../../integrations/supabase/client';

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
    // Log authentication attempt for debugging
    console.log('Attempting to sign in with:', { email, password: '****' });
    
    // Attempt to login with the provided credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error.message);
      
      // More descriptive error messages
      if (error.message.includes('Invalid login credentials')) {
        return { 
          success: false, 
          message: 'Invalid email or password. Please check your credentials and try again.' 
        };
      }
      
      return { success: false, message: error.message };
    }

    if (!data.user || !data.session) {
      console.error('Login response missing user or session data');
      return { success: false, message: 'Login failed: missing user data' };
    }
    
    console.log('Authentication successful, session established');
    console.log('User data:', data.user);
    
    // Get user role from metadata
    const userRole = data.user.user_metadata?.user_role || 'student';
    const userName = data.user.user_metadata?.full_name || data.user.email.split('@')[0];
    
    // Create user object with profile data
    const userWithProfile = {
      ...data.user,
      name: userName,
      role: userRole
    };
    
    // Store user info in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userWithProfile));
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('session', JSON.stringify(data.session));
    
    console.log('Login successful for', userWithProfile.name, 'with role', userRole);
    return { 
      success: true, 
      message: 'Login successful', 
      user: userWithProfile,
      session: data.session
    };
  } catch (error) {
    console.error('Unexpected error during login:', error);
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
      console.log('No authenticated session found');
      return null;
    }
    
    // Get additional user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error('Error getting user profile:', profileError.message);
      return {
        ...session.user,
        role: session.user.user_metadata?.user_role || 'student',
        name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
      };
    }
    
    // Combine auth user with profile data
    if (profileData) {
      return {
        ...session.user,
        name: profileData.full_name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
        role: profileData.user_role || session.user.user_metadata?.user_role || 'student'
      };
    }
    
    return {
      ...session.user,
      role: session.user.user_metadata?.user_role || 'student',
      name: session.user.user_metadata?.full_name || session.user.email.split('@')[0]
    };
  } catch (error) {
    console.error('Unexpected error when getting current user:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('session');
    
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
