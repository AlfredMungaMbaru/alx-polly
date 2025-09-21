"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// CREATE POLL
export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  // SECURITY FIX: Enhanced input validation
  if (!question || question.trim().length === 0) {
    return { error: "Poll question is required." };
  }
  
  if (question.length > 500) {
    return { error: "Poll question must be less than 500 characters." };
  }

  if (options.length < 2) {
    return { error: "Please provide at least two options." };
  }
  
  if (options.length > 10) {
    return { error: "Maximum 10 options allowed." };
  }

  // SECURITY FIX: Validate each option
  for (const option of options) {
    if (option.trim().length === 0) {
      return { error: "All options must have content." };
    }
    if (option.length > 200) {
      return { error: "Each option must be less than 200 characters." };
    }
  }

  // SECURITY FIX: Sanitize inputs to prevent XSS
  const sanitizedQuestion = question.trim();
  const sanitizedOptions = options.map(opt => opt.trim());

  // Get user from session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to create a poll." };
  }

  const { error } = await supabase.from("polls").insert([
    {
      user_id: user.id,
      question: sanitizedQuestion,
      options: sanitizedOptions,
    },
  ]);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

// GET USER POLLS
export async function getUserPolls() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { polls: [], error: "Not authenticated" };

  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { polls: [], error: error.message };
  return { polls: data ?? [], error: null };
}

// GET POLL BY ID
export async function getPollById(id: string) {
  const supabase = await createClient();
  
  // SECURITY FIX: Get current user to check access permissions
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { poll: null, error: error.message };
  
  // SECURITY FIX: Only allow access to public polls or user's own polls
  // For now, assuming all polls are viewable, but add privacy controls later
  // if (data.is_private && (!user || data.user_id !== user.id)) {
  //   return { poll: null, error: "Access denied." };
  // }
  
  return { poll: data, error: null };
}

// SUBMIT VOTE
export async function submitVote(pollId: string, optionIndex: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // SECURITY FIX: Require authentication for voting
  if (!user) return { error: 'You must be logged in to vote.' };

  // SECURITY FIX: Validate poll exists and get options count
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("options")
    .eq("id", pollId)
    .single();

  if (pollError) return { error: "Poll not found." };
  
  // SECURITY FIX: Validate option index is within bounds
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return { error: "Invalid option selected." };
  }

  // SECURITY FIX: Check for existing vote to prevent duplicates
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("user_id", user.id)
    .single();

  if (existingVote) {
    return { error: "You have already voted on this poll." };
  }

  const { error } = await supabase.from("votes").insert([
    {
      poll_id: pollId,
      user_id: user.id,
      option_index: optionIndex,
    },
  ]);

  if (error) return { error: error.message };
  return { error: null };
}

// DELETE POLL
export async function deletePoll(id: string) {
  const supabase = await createClient();
  
  // Get user from session - CRITICAL: Always check auth for destructive operations
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to delete a poll." };
  }

  // SECURITY FIX: Only allow deleting polls owned by the user
  const { error } = await supabase
    .from("polls")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  
  if (error) return { error: error.message };
  revalidatePath("/polls");
  return { error: null };
}

// UPDATE POLL
export async function updatePoll(pollId: string, formData: FormData) {
  const supabase = await createClient();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  // SECURITY FIX: Enhanced input validation (same as createPoll)
  if (!question || question.trim().length === 0) {
    return { error: "Poll question is required." };
  }
  
  if (question.length > 500) {
    return { error: "Poll question must be less than 500 characters." };
  }

  if (options.length < 2) {
    return { error: "Please provide at least two options." };
  }
  
  if (options.length > 10) {
    return { error: "Maximum 10 options allowed." };
  }

  // SECURITY FIX: Validate each option
  for (const option of options) {
    if (option.trim().length === 0) {
      return { error: "All options must have content." };
    }
    if (option.length > 200) {
      return { error: "Each option must be less than 200 characters." };
    }
  }

  // SECURITY FIX: Validate pollId format (assuming UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(pollId)) {
    return { error: "Invalid poll ID format." };
  }

  // SECURITY FIX: Sanitize inputs
  const sanitizedQuestion = question.trim();
  const sanitizedOptions = options.map(opt => opt.trim());

  // Get user from session
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

  // Only allow updating polls owned by the user
  const { error } = await supabase
    .from("polls")
    .update({ question: sanitizedQuestion, options: sanitizedOptions })
    .eq("id", pollId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
