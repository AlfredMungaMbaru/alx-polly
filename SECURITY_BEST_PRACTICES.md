# 🛡️ ALX POLLY - SECURITY BEST PRACTICES GUIDE

This guide establishes security standards and best practices for the ALX Polly development team.

---

## 🎯 SECURITY PRINCIPLES

### 1. **Defense in Depth**
Implement multiple layers of security controls rather than relying on a single defense mechanism.

### 2. **Least Privilege**
Grant users and systems only the minimum permissions necessary to perform their functions.

### 3. **Fail Secure**
When systems fail, they should fail in a secure state that denies access rather than allowing it.

### 4. **Input Validation**
Never trust user input - validate, sanitize, and escape all data from external sources.

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication Best Practices

#### ✅ DO:
- Always verify user identity before granting access
- Use strong authentication mechanisms (Supabase Auth)
- Implement proper session management
- Log authentication events for monitoring

#### ❌ DON'T:
- Store passwords in plain text
- Use weak or predictable session tokens
- Allow authentication bypass in any code path
- Ignore failed authentication attempts

### Authorization Best Practices

#### ✅ DO:
```typescript
// Always check user ownership for sensitive operations
export async function deletePoll(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };
  
  // Check ownership before deletion
  const { error } = await supabase
    .from("polls")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // Critical ownership check
}
```

#### ❌ DON'T:
```typescript
// NEVER do direct operations without authorization
export async function deletePoll(id: string) {
  const { error } = await supabase.from("polls").delete().eq("id", id);
  // This allows anyone to delete any poll!
}
```

---

## 📝 INPUT VALIDATION & SANITIZATION

### Validation Rules

#### String Inputs
```typescript
function validatePollQuestion(question: string): string | null {
  // Check for required content
  if (!question || question.trim().length === 0) {
    return "Question is required";
  }
  
  // Check length limits
  if (question.length > 500) {
    return "Question must be less than 500 characters";
  }
  
  // Sanitize input
  const sanitized = question.trim();
  
  return null; // No errors
}
```

#### Numeric Inputs
```typescript
function validateOptionIndex(index: number, maxOptions: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < maxOptions;
}
```

#### Array Inputs
```typescript
function validatePollOptions(options: string[]): string | null {
  if (options.length < 2) return "At least 2 options required";
  if (options.length > 10) return "Maximum 10 options allowed";
  
  for (const option of options) {
    if (!option.trim()) return "All options must have content";
    if (option.length > 200) return "Options must be under 200 characters";
  }
  
  return null;
}
```

### XSS Prevention

#### ✅ DO:
- Sanitize all user inputs before storage
- Use proper encoding when displaying user content
- Implement Content Security Policy headers
- Validate HTML content if accepting rich text

#### ❌ DON'T:
- Directly insert user input into HTML
- Trust client-side validation alone
- Use `dangerouslySetInnerHTML` without sanitization

---

## 🗄️ DATABASE SECURITY

### Supabase Security

#### Row Level Security (RLS)
```sql
-- Example RLS policy for polls table
CREATE POLICY "Users can only delete their own polls" ON polls
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all public polls" ON polls
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);
```

#### Query Security
```typescript
// ✅ Good: Use parameterized queries (Supabase handles this)
const { data } = await supabase
  .from("polls")
  .select("*")
  .eq("user_id", userId);

// ❌ Bad: Never construct raw SQL with user input
// const query = `SELECT * FROM polls WHERE user_id = '${userId}'`;
```

---

## 🌐 API SECURITY

### Server Actions Security

#### Rate Limiting
```typescript
import { checkRateLimit } from "@/lib/utils/rate-limit";

export async function createPoll(formData: FormData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required" };
  
  // Check rate limit: 5 polls per hour
  const rateCheck = checkRateLimit(user.id, "create_poll", 5, 3600000);
  if (!rateCheck.allowed) {
    return { error: "Rate limit exceeded. Try again later." };
  }
  
  // Continue with poll creation...
}
```

#### Error Handling
```typescript
// ✅ Good: Don't expose internal errors
try {
  const result = await sensitiveOperation();
  return { data: result };
} catch (error) {
  console.error("Internal error:", error); // Log for debugging
  return { error: "An error occurred. Please try again." }; // Generic user message
}

// ❌ Bad: Exposing internal information
catch (error) {
  return { error: error.message }; // Could expose sensitive info
}
```

---

## 🚦 MIDDLEWARE & ROUTING

### Route Protection Patterns

#### Protected Routes
```typescript
// middleware.ts
export const config = {
  matcher: [
    // Protect all routes except public ones
    '/((?!api/public|_next/static|_next/image|favicon.ico|login|register|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
```

#### Admin Route Protection
```typescript
export async function updateSession(request: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
}
```

---

## 🔒 CLIENT-SIDE SECURITY

### React Component Security

#### Safe URL Handling
```typescript
// ✅ Good: Validate URLs before using
const shareUrl = useMemo(() => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/polls/${pollId}`;
}, [pollId]);

const handleShare = () => {
  if (!shareUrl.startsWith(window.location.origin)) {
    console.error('Invalid URL detected');
    return;
  }
  
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
};
```

#### Input Sanitization
```typescript
// ✅ Good: Sanitize before display
const sanitizedTitle = useMemo(() => {
  return pollTitle.replace(/[<>]/g, '').trim();
}, [pollTitle]);
```

### Environment Variables

#### ✅ DO:
- Use `NEXT_PUBLIC_` prefix only for truly public values
- Store sensitive values in server-side environment variables
- Use `.env.local` for local development
- Document required variables in `.env.example`

#### ❌ DON'T:
- Put sensitive keys in `NEXT_PUBLIC_` variables
- Commit `.env` files to version control
- Use production keys in development

---

## 📊 SECURITY MONITORING

### Logging Best Practices

#### Security Events to Log
```typescript
// Authentication events
console.log(`User login attempt: ${email} - ${success ? 'SUCCESS' : 'FAILED'}`);

// Authorization failures
console.warn(`Unauthorized access attempt: User ${userId} tried to access ${resource}`);

// Suspicious activities
console.error(`Rate limit exceeded: User ${userId} - Action: ${action}`);
```

#### What NOT to Log
- Passwords or sensitive tokens
- Personal information (PII)
- Full stack traces in production
- Database connection strings

### Error Handling

#### ✅ Good Error Handling
```typescript
try {
  await sensitiveOperation();
} catch (error) {
  // Log detailed error for developers
  console.error('Operation failed:', {
    operation: 'sensitiveOperation',
    userId: user.id,
    timestamp: new Date().toISOString(),
    error: error.message
  });
  
  // Return generic error to user
  return { error: 'Unable to complete operation. Please try again.' };
}
```

---

## 🧪 SECURITY TESTING

### Manual Security Tests

#### Authentication Tests
- [ ] Try accessing protected routes without authentication
- [ ] Attempt to access other users' resources
- [ ] Test session timeout behavior
- [ ] Verify logout functionality

#### Input Validation Tests
- [ ] Submit empty or null values
- [ ] Test with extremely long inputs
- [ ] Try special characters and scripts
- [ ] Test with malformed data

#### Authorization Tests
- [ ] Attempt to delete other users' polls
- [ ] Try to vote multiple times
- [ ] Access admin routes as regular user
- [ ] Modify requests to bypass ownership checks

### Automated Security Testing

#### ESLint Security Rules
```json
{
  "extends": ["plugin:security/recommended"],
  "rules": {
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "error",
    "security/detect-unsafe-regex": "error"
  }
}
```

---

## 📋 SECURITY CHECKLIST

### Pre-Development
- [ ] Review security requirements for new features
- [ ] Identify potential security risks
- [ ] Plan security controls and validation

### During Development
- [ ] Implement input validation for all user inputs
- [ ] Add authorization checks for sensitive operations
- [ ] Use parameterized queries/ORM methods
- [ ] Sanitize outputs when displaying user content
- [ ] Add proper error handling

### Code Review
- [ ] Verify authentication is required where needed
- [ ] Check authorization logic for business rules
- [ ] Review input validation completeness
- [ ] Ensure sensitive data is not logged
- [ ] Confirm error messages don't leak information

### Pre-Deployment
- [ ] Run security linting tools
- [ ] Test authentication and authorization flows
- [ ] Verify rate limiting is working
- [ ] Check security headers are configured
- [ ] Review environment variable usage

### Post-Deployment
- [ ] Monitor security logs for anomalies
- [ ] Verify security headers in production
- [ ] Test critical security controls
- [ ] Monitor error rates and patterns

---

## 🚨 INCIDENT RESPONSE

### Security Incident Types
1. **Authentication Bypass**
2. **Data Breach**
3. **Unauthorized Access**
4. **Code Injection**
5. **Denial of Service**

### Response Steps
1. **Identify**: Detect and confirm the security incident
2. **Contain**: Limit the scope and impact
3. **Investigate**: Determine root cause and extent
4. **Remediate**: Fix the vulnerability and recover
5. **Learn**: Document lessons and improve security

### Emergency Contacts
- **Development Team Lead**: [Contact Info]
- **Security Team**: [Contact Info]
- **DevOps/Infrastructure**: [Contact Info]

---

## 📚 SECURITY RESOURCES

### OWASP Resources
- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

### Framework-Specific
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [React Security](https://cheatsheetseries.owasp.org/cheatsheets/React_Security_Cheat_Sheet.html)

### Security Tools
- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)
- [Snyk Code Security](https://snyk.io/)
- [OWASP ZAP](https://owasp.org/www-project-zap/)

---

**Remember: Security is everyone's responsibility. When in doubt, ask for a security review!**