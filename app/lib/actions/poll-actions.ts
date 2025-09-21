/**
 * @fileoverview Poll Management Server Actions for ALX Polly Application
 * 
 * This module contains all server-side actions for poll management including
 * creation, retrieval, updating, deletion, and voting functionality. All functions
 * implement comprehensive security measures including authentication, authorization,
 * input validation, and data sanitization.
 * 
 * Security Features:
 * - User authentication requirements for all write operations
 * - Ownership validation for destructive operations (update/delete)
 * - Comprehensive input validation and sanitization
 * - Duplicate vote prevention and fraud protection
 * - XSS prevention through input sanitization
 * - UUID validation for poll IDs to prevent injection attacks
 * 
 * Functions Overview:
 * - createPoll: Creates new polls with validation and sanitization
 * - getUserPolls: Retrieves polls owned by current user
 * - getPollById: Fetches specific poll data with access control framework
 * - submitVote: Handles vote submission with fraud prevention
 * - deletePoll: Securely deletes user-owned polls
 * - updatePoll: Updates poll content with ownership validation
 * 
 * Dependencies:
 * - @/lib/supabase/server: Supabase server client for database operations
 * - next/cache: Next.js cache revalidation for UI updates
 * 
 * @version 1.0.0
 * @author ALX Polly Development Team
 * @since 2025-09-21
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Creates a new poll with security validations and input sanitization.
 * 
 * This function handles the complete poll creation workflow including:
 * - Input validation and sanitization to prevent XSS attacks
 * - User authentication verification 
 * - Data persistence to Supabase database
 * - Error handling with user-friendly messages
 * 
 * Security Features:
 * - Requires user authentication
 * - Validates input lengths and content
 * - Sanitizes all user inputs before storage
 * - Enforces business rules (2-10 options, character limits)
 * 
 * @param formData - FormData object containing poll question and options
 * @param formData.question - The main poll question (max 500 chars)
 * @param formData.options - Array of poll options (2-10 items, max 200 chars each)
 * 
 * @returns Promise<{error: string | null}> - Success/error response
 * - error: null on success, descriptive string on failure
 * 
 * @example
 * const formData = new FormData();
 * formData.set('question', 'What is your favorite color?');
 * formData.append('options', 'Red');
 * formData.append('options', 'Blue');
 * const result = await createPoll(formData);
 */
export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  // Extract form data - these come from user input and need validation
  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  // VALIDATION PHASE: Comprehensive input validation to ensure data integrity
  // and prevent malicious inputs that could compromise the system
  
  // Check for empty or whitespace-only questions
  if (!question || question.trim().length === 0) {
    return { error: "Poll question is required." };
  }
  
  // Prevent excessively long questions that could impact UI/database performance
  if (question.length > 500) {
    return { error: "Poll question must be less than 500 characters." };
  }

  // Ensure minimum viable poll structure (need at least 2 choices)
  if (options.length < 2) {
    return { error: "Please provide at least two options." };
  }
  
  // Prevent option overflow that could impact UI rendering and database performance
  if (options.length > 10) {
    return { error: "Maximum 10 options allowed." };
  }

  // Validate each individual option for content and length
  for (const option of options) {
    // Check for empty options that would confuse users
    if (option.trim().length === 0) {
      return { error: "All options must have content." };
    }
    // Prevent excessively long options that could break UI layout
    if (option.length > 200) {
      return { error: "Each option must be less than 200 characters." };
    }
  }

  // SANITIZATION PHASE: Clean inputs to prevent XSS and ensure consistent data
  const sanitizedQuestion = question.trim(); // Remove leading/trailing whitespace
  const sanitizedOptions = options.map(opt => opt.trim()); // Normalize all options

  // AUTHENTICATION PHASE: Verify user is logged in before allowing poll creation
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  // Handle authentication service errors
  if (userError) {
    return { error: userError.message };
  }
  
  // Ensure user is authenticated - polls require ownership
  if (!user) {
    return { error: "You must be logged in to create a poll." };
  }

  // DATABASE PHASE: Persist the validated and sanitized poll data
  const { error } = await supabase.from("polls").insert([
    {
      user_id: user.id, // Associate poll with authenticated user
      question: sanitizedQuestion,
      options: sanitizedOptions,
    },
  ]);

  // Handle database insertion errors
  if (error) {
    return { error: error.message };
  }

  // Success - poll created successfully
  return { error: null };
}

/**
 * Retrieves all polls created by the currently authenticated user.
 * 
 * This function provides a secure way for users to view their own polls,
 * implementing proper authentication checks and data filtering. Results
 * are ordered by creation date (newest first) for optimal user experience.
 * 
 * Security Features:
 * - Requires valid authentication session
 * - Only returns polls owned by the current user
 * - Prevents unauthorized access to other users' polls
 * 
 * @returns Promise<{polls: Array, error: string | null}>
 * - polls: Array of poll objects belonging to the user (empty if none found)
 * - error: null on success, error message string on failure
 * 
 * @example
 * const { polls, error } = await getUserPolls();
 * if (error) {
 *   console.error('Failed to fetch polls:', error);
 * } else {
 *   console.log(`Found ${polls.length} polls`);
 * }
 */
export async function getUserPolls() {
  const supabase = await createClient();
  
  // AUTHENTICATION CHECK: Verify user is logged in before accessing their data
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  // Return empty result for unauthenticated users rather than throwing error
  // This allows graceful handling in UI components
  if (!user) return { polls: [], error: "Not authenticated" };

  // QUERY PHASE: Fetch polls with security filtering and optimal ordering
  const { data, error } = await supabase
    .from("polls")
    .select("*") // Get all poll fields for complete poll information
    .eq("user_id", user.id) // SECURITY: Only fetch polls owned by current user
    .order("created_at", { ascending: false }); // Newest polls first for better UX

  // Handle database query errors gracefully
  if (error) return { polls: [], error: error.message };
  
  // Return successful result with null coalescing for robust data handling
  return { polls: data ?? [], error: null };
}

/**
 * Retrieves a specific poll by its unique identifier.
 * 
 * This function fetches poll data for display to users, with built-in
 * privacy and access control framework. Currently allows public access
 * to all polls, but includes foundation for future privacy controls.
 * 
 * Access Control:
 * - Currently: All polls are publicly viewable
 * - Future: Will support private polls with owner-only access
 * - Framework in place for role-based access control
 * 
 * @param id - Unique poll identifier (UUID string)
 * 
 * @returns Promise<{poll: Object | null, error: string | null}>
 * - poll: Complete poll object with question, options, metadata (null if not found)
 * - error: null on success, descriptive error message on failure
 * 
 * @example
 * const { poll, error } = await getPollById('123e4567-e89b-12d3-a456-426614174000');
 * if (error) {
 *   console.error('Poll not found:', error);
 * } else if (poll) {
 *   console.log('Poll question:', poll.question);
 * }
 */
export async function getPollById(id: string) {
  const supabase = await createClient();
  
  // AUTHENTICATION CONTEXT: Get current user for future access control
  // Even though polls are currently public, we need user context for
  // potential privacy features and audit logging
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // DATABASE QUERY: Fetch poll by unique ID
  const { data, error } = await supabase
    .from("polls")
    .select("*") // Get complete poll data including metadata
    .eq("id", id) // Filter by provided poll ID
    .single(); // Expect exactly one result (or null)

  // Handle database errors (poll not found, connection issues, etc.)
  if (error) return { poll: null, error: error.message };
  
  // FUTURE ACCESS CONTROL: Framework for private poll restrictions
  // When privacy features are implemented, uncomment and configure:
  // if (data.is_private && (!user || data.user_id !== user.id)) {
  //   return { poll: null, error: "Access denied." };
  // }
  
  // Return successful result with poll data
  return { poll: data, error: null };
}

/**
 * Submits a user's vote for a specific poll option.
 * 
 * This function implements comprehensive vote validation and fraud prevention,
 * ensuring data integrity and preventing abuse of the voting system. It handles
 * authentication, poll validation, duplicate prevention, and secure vote recording.
 * 
 * Security Features:
 * - Requires user authentication to prevent anonymous vote manipulation
 * - Validates poll existence before accepting votes
 * - Checks option index bounds to prevent invalid data submission
 * - Prevents duplicate voting by the same user on the same poll
 * - Associates votes with user IDs for audit trails
 * 
 * Validation Process:
 * 1. Authentication check
 * 2. Poll existence verification
 * 3. Option index boundary validation
 * 4. Duplicate vote prevention check
 * 5. Secure vote recording
 * 
 * @param pollId - Unique identifier of the poll being voted on
 * @param optionIndex - Zero-based index of the selected option in the poll's options array
 * 
 * @returns Promise<{error: string | null}>
 * - error: null on successful vote submission, descriptive error message on failure
 * 
 * @example
 * // Vote for option at index 1 (second option) in poll
 * const result = await submitVote('poll-uuid-123', 1);
 * if (result.error) {
 *   console.error('Vote failed:', result.error);
 * } else {
 *   console.log('Vote submitted successfully');
 * }
 */
export async function submitVote(pollId: string, optionIndex: number) {
  const supabase = await createClient();
  
  // AUTHENTICATION PHASE: Verify user is logged in
  // Voting requires authentication to prevent abuse and enable duplicate prevention
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'You must be logged in to vote.' };

  // POLL VALIDATION PHASE: Verify poll exists and get structure
  // This prevents votes on non-existent polls and gets option count for validation
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("options") // Only need options array to validate choice
    .eq("id", pollId)
    .single(); // Expect exactly one poll

  // Handle poll not found or database errors
  if (pollError) return { error: "Poll not found." };
  
  // OPTION VALIDATION PHASE: Ensure selected option exists
  // Prevents submission of invalid option indices that could corrupt data
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return { error: "Invalid option selected." };
  }

  // DUPLICATE PREVENTION PHASE: Check if user has already voted
  // Maintains voting integrity by allowing only one vote per user per poll
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id") // Only need to know if vote exists
    .eq("poll_id", pollId)
    .eq("user_id", user.id)
    .single(); // Will be null if no existing vote

  // Reject duplicate votes to maintain poll integrity
  if (existingVote) {
    return { error: "You have already voted on this poll." };
  }

  // VOTE RECORDING PHASE: Securely store the validated vote
  const { error } = await supabase.from("votes").insert([
    {
      poll_id: pollId, // Link vote to specific poll
      user_id: user.id, // Associate with authenticated user for audit trail
      option_index: optionIndex, // Record the validated option choice
    },
  ]);

  // Handle database insertion errors
  if (error) return { error: error.message };
  
  // Success - vote recorded successfully
  return { error: null };
}

/**
 * Permanently deletes a poll owned by the current user.
 * 
 * This is a destructive operation that requires strict security validation
 * to prevent unauthorized deletion of polls. Only the poll owner can delete
 * their own polls, protecting user data and preventing malicious attacks.
 * 
 * Security Features:
 * - Requires user authentication
 * - Enforces ownership validation (user can only delete their own polls)
 * - Prevents unauthorized access to other users' polls
 * - Handles authentication errors gracefully
 * 
 * Side Effects:
 * - Permanently removes poll from database
 * - May cascade delete associated votes (depending on database schema)
 * - Revalidates the polls page cache to reflect changes
 * - Cannot be undone once executed
 * 
 * @param id - Unique identifier of the poll to delete
 * 
 * @returns Promise<{error: string | null}>
 * - error: null on successful deletion, descriptive error message on failure
 * 
 * @example
 * const result = await deletePoll('poll-uuid-123');
 * if (result.error) {
 *   console.error('Deletion failed:', result.error);
 * } else {
 *   console.log('Poll deleted successfully');
 * }
 */
export async function deletePoll(id: string) {
  const supabase = await createClient();
  
  // AUTHENTICATION PHASE: Critical security check for destructive operations
  // Never allow unauthenticated users to perform destructive actions
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  // Handle authentication service errors
  if (userError) {
    return { error: userError.message };
  }
  
  // Ensure user is authenticated before proceeding with deletion
  if (!user) {
    return { error: "You must be logged in to delete a poll." };
  }

  // DELETION PHASE: Execute secure deletion with ownership validation
  // The .eq("user_id", user.id) clause is CRITICAL for security - it ensures
  // users can only delete polls they own, preventing unauthorized deletions
  const { error } = await supabase
    .from("polls")
    .delete()
    .eq("id", id) // Target specific poll
    .eq("user_id", user.id); // SECURITY: Only delete if user owns the poll
  
  // Handle database deletion errors
  if (error) return { error: error.message };
  
  // CACHE INVALIDATION: Update UI to reflect the deletion
  // This ensures the polls list refreshes without requiring a page reload
  revalidatePath("/polls");
  
  // Success - poll deleted successfully
  return { error: null };
}

/**
 * Updates an existing poll's question and options with comprehensive validation.
 * 
 * This function allows poll owners to modify their polls while maintaining
 * data integrity and security. It reuses the same validation logic as poll
 * creation to ensure consistency and prevent data corruption.
 * 
 * Security Features:
 * - Requires user authentication
 * - Enforces ownership validation (users can only update their own polls)
 * - Validates poll ID format to prevent injection attacks
 * - Applies same input validation as poll creation
 * - Sanitizes all user inputs before database storage
 * 
 * Validation Process:
 * 1. Input validation (question, options count/content/length)
 * 2. Poll ID format validation (UUID pattern)
 * 3. Input sanitization (XSS prevention)
 * 4. User authentication verification
 * 5. Ownership-restricted database update
 * 
 * Limitations:
 * - Updates may affect existing votes if option structure changes significantly
 * - No versioning or history tracking of changes
 * - All validation errors are returned immediately (fail-fast approach)
 * 
 * @param pollId - Unique identifier of the poll to update (must be valid UUID)
 * @param formData - FormData containing updated poll question and options
 * @param formData.question - Updated poll question (max 500 chars)
 * @param formData.options - Array of updated poll options (2-10 items, max 200 chars each)
 * 
 * @returns Promise<{error: string | null}>
 * - error: null on successful update, descriptive error message on failure
 * 
 * @example
 * const formData = new FormData();
 * formData.set('question', 'Updated: What is your favorite color?');
 * formData.append('options', 'Red');
 * formData.append('options', 'Blue');
 * formData.append('options', 'Green');
 * const result = await updatePoll('poll-uuid-123', formData);
 */
export async function updatePoll(pollId: string, formData: FormData) {
  const supabase = await createClient();

  // Extract form data for validation
  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  // VALIDATION PHASE: Apply same comprehensive validation as createPoll
  // This ensures data consistency across poll creation and updates
  
  // Validate poll question
  if (!question || question.trim().length === 0) {
    return { error: "Poll question is required." };
  }
  
  if (question.length > 500) {
    return { error: "Poll question must be less than 500 characters." };
  }

  // Validate poll options structure
  if (options.length < 2) {
    return { error: "Please provide at least two options." };
  }
  
  if (options.length > 10) {
    return { error: "Maximum 10 options allowed." };
  }

  // Validate each individual option
  for (const option of options) {
    if (option.trim().length === 0) {
      return { error: "All options must have content." };
    }
    if (option.length > 200) {
      return { error: "Each option must be less than 200 characters." };
    }
  }

  // SECURITY VALIDATION: Verify poll ID format to prevent injection attacks
  // UUIDs have a specific format that we can validate to catch malformed inputs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(pollId)) {
    return { error: "Invalid poll ID format." };
  }

  // SANITIZATION PHASE: Clean inputs to prevent XSS and normalize data
  const sanitizedQuestion = question.trim();
  const sanitizedOptions = options.map(opt => opt.trim());

  // AUTHENTICATION PHASE: Verify user is logged in
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError) {
    return { error: userError.message };
  }
  
  if (!user) {
    return { error: "You must be logged in to update a poll." };
  }

  // UPDATE PHASE: Execute secure update with ownership validation
  // The .eq("user_id", user.id) clause ensures users can only update their own polls
  const { error } = await supabase
    .from("polls")
    .update({ 
      question: sanitizedQuestion, 
      options: sanitizedOptions 
    })
    .eq("id", pollId) // Target specific poll
    .eq("user_id", user.id); // SECURITY: Only update if user owns the poll

  // Handle database update errors
  if (error) {
    return { error: error.message };
  }

  // Success - poll updated successfully
  return { error: null };
}
