// Rate limiting utility to prevent abuse
const rateLimits = new Map();

export function checkRateLimit(userId: string, action: string, maxAttempts: number = 5, windowMs: number = 60000) {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const userLimits = rateLimits.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > userLimits.resetTime) {
    // Reset the window
    userLimits.count = 0;
    userLimits.resetTime = now + windowMs;
  }

  if (userLimits.count >= maxAttempts) {
    return { allowed: false, remaining: 0, resetTime: userLimits.resetTime };
  }

  userLimits.count++;
  rateLimits.set(key, userLimits);

  return { 
    allowed: true, 
    remaining: maxAttempts - userLimits.count, 
    resetTime: userLimits.resetTime 
  };
}

// Example usage in poll actions:
// const rateCheck = checkRateLimit(user.id, 'create_poll', 10, 3600000); // 10 polls per hour
// if (!rateCheck.allowed) return { error: 'Rate limit exceeded. Try again later.' };