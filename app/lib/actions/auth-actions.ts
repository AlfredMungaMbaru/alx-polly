/**
 * @fileoverview Authentication Server Actions for ALX Polly Application
 * 
 * This module provides secure authentication functionality including user login,
 * registration, logout, and session management. All functions integrate with
 * Supabase Auth for secure user management and session handling.
 * 
 * Authentication Flow:
 * 1. User Registration: Creates new user accounts with email/password
 * 2. User Login: Authenticates existing users and establishes sessions
 * 3. Session Management: Retrieves current user and session information
 * 4. User Logout: Securely terminates user sessions
 * 
 * Security Features:
 * - Email/password authentication via Supabase Auth
 * - Secure session management with HTTP-only cookies
 * - Automatic session refresh and validation
 * - Comprehensive error handling without information leakage
 * 
 * Dependencies:
 * - @/lib/supabase/server: Supabase server client for auth operations
 * - ../types: TypeScript interfaces for form data validation
 * 
 * @version 1.0.0
 * @author ALX Polly Development Team
 * @since 2025-09-21
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginFormData, RegisterFormData } from '../types';

/**
 * Authenticates a user with email and password credentials.
 * 
 * This function handles the complete login workflow including credential
 * validation, session establishment, and error handling. It integrates with
 * Supabase Auth to provide secure authentication with automatic session
 * management via HTTP-only cookies.
 * 
 * Authentication Process:
 * 1. Validates user credentials against Supabase Auth
 * 2. Establishes secure session with automatic cookie management
 * 3. Returns success/error status for UI feedback
 * 
 * Session Security:
 * - Sessions are managed via HTTP-only cookies (XSS protection)
 * - Automatic session refresh handled by Supabase
 * - Secure session invalidation on logout
 * 
 * @param data - User login credentials
 * @param data.email - User's email address (validated by Supabase)
 * @param data.password - User's password (securely transmitted to Supabase)
 * 
 * @returns Promise<{error: string | null}>
 * - error: null on successful authentication, error message on failure
 * 
 * @example
 * const loginResult = await login({
 *   email: 'user@example.com',
 *   password: 'securePassword123'
 * });
 * 
 * if (loginResult.error) {
 *   console.error('Login failed:', loginResult.error);
 * } else {
 *   console.log('User logged in successfully');
 * }
 */
export async function login(data: LoginFormData) {
  const supabase = await createClient();

  // AUTHENTICATION PHASE: Validate credentials with Supabase Auth
  // Supabase handles password hashing, rate limiting, and security validations
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email, // Email is validated by Supabase (format, existence)
    password: data.password, // Password is securely transmitted and validated
  });

  // Handle authentication errors (invalid credentials, account issues, etc.)
  if (error) {
    return { error: error.message };
  }

  // SUCCESS: Session established, user authenticated
  // Session cookies are automatically set by Supabase for subsequent requests
  return { error: null };
}

/**
 * Registers a new user account with email, password, and profile information.
 * 
 * This function creates new user accounts with comprehensive profile data
 * and automatic email verification (if configured). It handles user registration
 * through Supabase Auth with additional metadata storage for user profiles.
 * 
 * Registration Process:
 * 1. Creates new user account with Supabase Auth
 * 2. Stores additional profile data (name) in user metadata
 * 3. Triggers email verification if configured
 * 4. Returns registration status for UI feedback
 * 
 * Security Features:
 * - Password strength validation (handled by Supabase)
 * - Email format and deliverability validation
 * - Duplicate account prevention
 * - Secure storage of user metadata
 * 
 * @param data - User registration information
 * @param data.email - User's email address (must be valid and unique)
 * @param data.password - User's password (validated by Supabase password policy)
 * @param data.name - User's display name (stored in profile metadata)
 * 
 * @returns Promise<{error: string | null}>
 * - error: null on successful registration, error message on failure
 * 
 * @example
 * const registerResult = await register({
 *   email: 'newuser@example.com',
 *   password: 'securePassword123',
 *   name: 'John Doe'
 * });
 * 
 * if (registerResult.error) {
 *   console.error('Registration failed:', registerResult.error);
 * } else {
 *   console.log('User registered successfully');
 * }
 */
export async function register(data: RegisterFormData) {
  const supabase = await createClient();

  // REGISTRATION PHASE: Create new user account with profile data
  const { error } = await supabase.auth.signUp({
    email: data.email, // Primary identifier, must be unique
    password: data.password, // Securely hashed by Supabase
    options: {
      data: {
        // Additional user metadata stored in auth.users.user_metadata
        name: data.name, // Display name for user profile
      },
    },
  });

  // Handle registration errors (duplicate email, weak password, etc.)
  if (error) {
    return { error: error.message };
  }

  // SUCCESS: User account created
  // Email verification may be required based on Supabase configuration
  return { error: null };
}

/**
 * Securely logs out the current user and terminates their session.
 * 
 * This function handles complete session termination including cookie cleanup
 * and server-side session invalidation. It ensures secure logout that prevents
 * session hijacking and unauthorized access to user accounts.
 * 
 * Logout Process:
 * 1. Invalidates current session on Supabase servers
 * 2. Clears authentication cookies from client
 * 3. Ensures complete session termination
 * 
 * Security Features:
 * - Server-side session invalidation
 * - Automatic cookie cleanup
 * - Protection against session fixation attacks
 * - Graceful error handling for partial logout scenarios
 * 
 * @returns Promise<{error: string | null}>
 * - error: null on successful logout, error message on failure
 * 
 * @example
 * const logoutResult = await logout();
 * if (logoutResult.error) {
 *   console.error('Logout failed:', logoutResult.error);
 * } else {
 *   console.log('User logged out successfully');
 *   // Redirect to login page or home
 * }
 */
export async function logout() {
  const supabase = await createClient();
  
  // LOGOUT PHASE: Terminate session and clear authentication state
  const { error } = await supabase.auth.signOut();
  
  // Handle logout errors (network issues, session already expired, etc.)
  if (error) {
    return { error: error.message };
  }
  
  // SUCCESS: Session terminated, user logged out
  // Authentication cookies are automatically cleared by Supabase
  return { error: null };
}

/**
 * Retrieves the currently authenticated user's information.
 * 
 * This function provides access to the current user's profile data and
 * authentication status. It's used throughout the application to determine
 * user state and personalize the user experience.
 * 
 * User Data Include:
 * - User ID (UUID)
 * - Email address
 * - Profile metadata (name, etc.)
 * - Authentication timestamps
 * - Email verification status
 * 
 * Privacy & Security:
 * - Only returns data for the current authenticated user
 * - No sensitive authentication data exposed
 * - Automatic session validation
 * 
 * @returns Promise<User | null>
 * - User object with profile information if authenticated
 * - null if user is not authenticated or session is invalid
 * 
 * @example
 * const currentUser = await getCurrentUser();
 * if (currentUser) {
 *   console.log('Logged in as:', currentUser.email);
 *   console.log('User name:', currentUser.user_metadata?.name);
 * } else {
 *   console.log('User not authenticated');
 * }
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  
  // AUTHENTICATION CHECK: Retrieve current user from session
  // This validates the session and returns user data if valid
  const { data } = await supabase.auth.getUser();
  
  // Return user object or null if not authenticated
  // The user object contains profile data but no sensitive auth information
  return data.user;
}

/**
 * Retrieves the current authentication session information.
 * 
 * This function provides access to session metadata including tokens,
 * expiration times, and session status. It's primarily used for session
 * management and authentication state validation.
 * 
 * Session Information Includes:
 * - Access token (for API authentication)
 * - Refresh token (for automatic session renewal)
 * - Session expiration timestamps
 * - Token type and scope information
 * 
 * Use Cases:
 * - Session validation and renewal
 * - API authentication token retrieval
 * - Authentication state management
 * - Debugging authentication issues
 * 
 * @returns Promise<Session | null>
 * - Session object with authentication tokens if valid session exists
 * - null if no active session or session is expired
 * 
 * @example
 * const session = await getSession();
 * if (session) {
 *   console.log('Session expires at:', session.expires_at);
 *   console.log('Access token available:', !!session.access_token);
 * } else {
 *   console.log('No active session');
 * }
 */
export async function getSession() {
  const supabase = await createClient();
  
  // SESSION RETRIEVAL: Get current session with tokens and metadata
  const { data } = await supabase.auth.getSession();
  
  // Return session object or null if no active session
  // Session contains tokens and metadata but is securely managed
  return data.session;
}
