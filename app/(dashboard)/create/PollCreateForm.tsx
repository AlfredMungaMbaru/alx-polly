/**
 * @fileoverview Poll Creation Form Component for ALX Polly Application
 * 
 * This component provides a comprehensive form interface for creating new polls
 * with dynamic option management, real-time validation, and user feedback.
 * It implements the frontend UI for poll creation while delegating data validation
 * and persistence to the server-side createPoll action.
 * 
 * Features:
 * - Dynamic poll option management (add/remove options)
 * - Real-time form validation and user feedback
 * - Integration with server actions for secure poll creation
 * - Automatic redirect on successful poll creation
 * - Responsive design with Tailwind CSS styling
 * 
 * State Management:
 * - Options array for dynamic poll choices
 * - Error state for user feedback
 * - Success state for creation confirmation
 * 
 * @version 1.0.0
 * @author ALX Polly Development Team
 * @since 2025-09-21
 */

"use client";

import { useState } from "react";
import { createPoll } from "@/app/lib/actions/poll-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Interactive form component for creating new polls with dynamic options.
 * 
 * This component manages the complete poll creation user experience including:
 * - Dynamic option management (minimum 2, maximum 10 options)
 * - Real-time form state updates and validation
 * - Server action integration for secure poll persistence
 * - User feedback through error and success states
 * - Automatic navigation after successful creation
 * 
 * Component Architecture:
 * - Uses React hooks for local state management
 * - Integrates with Next.js Server Actions for form submission
 * - Implements controlled components for form inputs
 * - Provides immediate user feedback for actions
 * 
 * Validation:
 * - Client-side: Basic required field validation
 * - Server-side: Comprehensive validation via createPoll action
 * - User feedback: Real-time error and success messages
 * 
 * @returns JSX.Element - Rendered poll creation form with dynamic options
 * 
 * @example
 * // Usage in a page component
 * function CreatePollPage() {
 *   return (
 *     <div className="container mx-auto py-8">
 *       <h1>Create New Poll</h1>
 *       <PollCreateForm />
 *     </div>
 *   );
 * }
 */
export default function PollCreateForm() {
  // STATE MANAGEMENT: Local form state for dynamic UI updates
  
  /**
   * Array of poll option strings. Initialized with two empty options
   * as polls require a minimum of 2 choices. Users can add up to 10 options.
   */
  const [options, setOptions] = useState(["", ""]);
  
  /**
   * Error message state for displaying server-side validation errors
   * and form submission failures to users.
   */
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Success state indicator for showing poll creation confirmation
   * and triggering automatic redirect to polls list.
   */
  const [success, setSuccess] = useState(false);

  /**
   * Updates a specific poll option by index while preserving other options.
   * 
   * This function enables controlled input behavior for dynamic option fields,
   * ensuring each option input is properly synchronized with component state.
   * 
   * @param idx - Zero-based index of the option to update
   * @param value - New value for the option at the specified index
   */
  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  /**
   * Adds a new empty option to the poll options array.
   * 
   * Enables users to dynamically expand their poll with additional choices.
   * The maximum number of options is enforced server-side to prevent abuse.
   */
  const addOption = () => setOptions((opts) => [...opts, ""]);
  
  /**
   * Removes an option at the specified index from the options array.
   * 
   * Maintains minimum option requirement (2 options) by preventing removal
   * when only 2 options remain. This ensures polls always have sufficient choices.
   * 
   * @param idx - Zero-based index of the option to remove
   */
  const removeOption = (idx: number) => {
    // VALIDATION: Maintain minimum of 2 options for valid polls
    if (options.length > 2) {
      setOptions((opts) => opts.filter((_, i) => i !== idx));
    }
  };

  return (
    <form
      action={async (formData) => {
        // FORM SUBMISSION HANDLER: Process poll creation with user feedback
        
        // Reset UI state for new submission attempt
        setError(null);
        setSuccess(false);
        
        // SERVER ACTION: Submit form data to createPoll server action
        // This handles validation, sanitization, and database persistence
        const res = await createPoll(formData);
        
        if (res?.error) {
          // ERROR HANDLING: Display server-side validation errors
          setError(res.error);
        } else {
          // SUCCESS HANDLING: Show confirmation and redirect to polls list
          setSuccess(true);
          
          // AUTO-REDIRECT: Navigate to polls page after brief success message
          setTimeout(() => {
            window.location.href = "/polls";
          }, 1200);
        }
      }}
      className="space-y-6 max-w-md mx-auto"
    >
      {/* POLL QUESTION INPUT: Main poll question field */}
      <div>
        <Label htmlFor="question">Poll Question</Label>
        <Input 
          name="question" 
          id="question" 
          required 
          placeholder="Enter your poll question..."
        />
      </div>
      
      {/* DYNAMIC OPTIONS SECTION: Expandable poll choices */}
      <div>
        <Label>Options</Label>
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            {/* OPTION INPUT: Individual poll choice input */}
            <Input
              name="options"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              required
              placeholder={`Option ${idx + 1}`}
            />
            {/* REMOVE BUTTON: Only show when more than minimum options exist */}
            {options.length > 2 && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => removeOption(idx)}
                aria-label={`Remove option ${idx + 1}`}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        
        {/* ADD OPTION BUTTON: Expand poll with additional choices */}
        <Button 
          type="button" 
          onClick={addOption} 
          variant="secondary"
          disabled={options.length >= 10} // Prevent excessive options
        >
          Add Option
        </Button>
      </div>
      
      {/* USER FEEDBACK: Error and success message display */}
      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
          Poll created! Redirecting...
        </div>
      )}
      
      {/* SUBMIT BUTTON: Trigger poll creation */}
      <Button type="submit" className="w-full">
        Create Poll
      </Button>
    </form>
  );
} 