# 🗳️ ALX Polly - Modern Polling Application# ALX Polly: A Polling Application



A full-stack, secure polling application built with Next.js, Supabase, and TypeScript. Create, share, and vote on polls with real-time results and comprehensive security features.Welcome to ALX Polly, a full-stack polling application built with Next.js, TypeScript, and Supabase. This project serves as a practical learning ground for modern web development concepts, with a special focus on identifying and fixing common security vulnerabilities.



![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)## About the Application

![License](https://img.shields.io/badge/license-MIT-green.svg)

![Security](https://img.shields.io/badge/security-audited-brightgreen.svg)ALX Polly allows authenticated users to create, share, and vote on polls. It's a simple yet powerful application that demonstrates key features of modern web development:



## 🌟 Features-   **Authentication**: Secure user sign-up and login.

-   **Poll Management**: Users can create, view, and delete their own polls.

### Core Functionality-   **Voting System**: A straightforward system for casting and viewing votes.

- **🎯 Poll Creation**: Create polls with 2-10 customizable options-   **User Dashboard**: A personalized space for users to manage their polls.

- **🗳️ Secure Voting**: One vote per user with fraud prevention

- **📊 Real-time Results**: Live vote counting and result displayThe application is built with a modern tech stack:

- **👤 User Management**: Secure authentication and user profiles

- **📱 Responsive Design**: Mobile-first, accessible interface-   **Framework**: [Next.js](https://nextjs.org/) (App Router)

-   **Language**: [TypeScript](https://www.typescriptlang.org/)

### Security Features-   **Backend & Database**: [Supabase](https://supabase.io/)

- **🔐 Authentication**: Email/password with Supabase Auth-   **UI**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)

- **🛡️ Authorization**: User-based poll ownership and access control-   **State Management**: React Server Components and Client Components

- **✅ Input Validation**: Comprehensive client and server-side validation

- **🚫 XSS Protection**: Input sanitization and secure data handling---

- **🔄 CSRF Protection**: Built-in protection via Next.js and Supabase

- **📈 Rate Limiting**: Abuse prevention and API protection## 🚀 The Challenge: Security Audit & Remediation



### Developer ExperienceAs a developer, writing functional code is only half the battle. Ensuring that the code is secure, robust, and free of vulnerabilities is just as critical. This version of ALX Polly has been intentionally built with several security flaws, providing a real-world scenario for you to practice your security auditing skills.

- **📝 TypeScript**: Full type safety and excellent DX

- **🧪 Comprehensive Testing**: Security audited and validated**Your mission is to act as a security engineer tasked with auditing this codebase.**

- **📚 Documentation**: Detailed inline docs and examples

- **🔧 Modern Stack**: Latest Next.js, React, and Supabase features### Your Objectives:



## 🏗️ Tech Stack1.  **Identify Vulnerabilities**:

    -   Thoroughly review the codebase to find security weaknesses.

### Frontend    -   Pay close attention to user authentication, data access, and business logic.

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router    -   Think about how a malicious actor could misuse the application's features.

- **[React 18](https://reactjs.org/)** - UI library with Server Components

- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript2.  **Understand the Impact**:

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework    -   For each vulnerability you find, determine the potential impact.Query your AI assistant about it. What data could be exposed? What unauthorized actions could be performed?

- **[Shadcn/ui](https://ui.shadcn.com/)** - Modern component library

3.  **Propose and Implement Fixes**:

### Backend & Database    -   Once a vulnerability is identified, ask your AI assistant to fix it.

- **[Supabase](https://supabase.com/)** - Backend-as-a-Service    -   Write secure, efficient, and clean code to patch the security holes.

  - PostgreSQL database with real-time subscriptions    -   Ensure that your fixes do not break existing functionality for legitimate users.

  - Authentication and user management

  - Row Level Security (RLS) policies### Where to Start?

  - Edge Functions for serverless logic

A good security audit involves both static code analysis and dynamic testing. Here’s a suggested approach:

### Development & Deployment

- **[Vercel](https://vercel.com/)** - Deployment and hosting platform1.  **Familiarize Yourself with the Code**:

- **[ESLint](https://eslint.org/)** - Code linting and formatting    -   Start with `app/lib/actions/` to understand how the application interacts with the database.

- **[Git](https://git-scm.com/)** - Version control    -   Explore the page routes in the `app/(dashboard)/` directory. How is data displayed and managed?

    -   Look for hidden or undocumented features. Are there any pages not linked in the main UI?

## 🚀 Quick Start

2.  **Use Your AI Assistant**:

### Prerequisites    -   This is an open-book test. You are encouraged to use AI tools to help you.

    -   Ask your AI assistant to review snippets of code for security issues.

Ensure you have the following installed:    -   Describe a feature's behavior to your AI and ask it to identify potential attack vectors.

- **Node.js** (v18.0.0 or higher)    -   When you find a vulnerability, ask your AI for the best way to patch it.

- **npm** or **yarn** package manager

- **Git** for version control---



### 1. Clone and Install## Getting Started



```bashTo begin your security audit, you'll need to get the application running on your local machine.

# Clone the repository

git clone https://github.com/AlfredMungaMbaru/alx-polly.git### 1. Prerequisites

cd alx-polly

-   [Node.js](https://nodejs.org/) (v20.x or higher recommended)

# Install dependencies-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

npm install-   A [Supabase](https://supabase.io/) account (the project is pre-configured, but you may need your own for a clean slate).

# or

yarn install### 2. Installation

```

Clone the repository and install the dependencies:

### 2. Environment Setup

```bash

Create a `.env.local` file in the root directory:git clone <repository-url>

cd alx-polly

```bashnpm install

# Copy the example environment file```

cp .env.example .env.local

```### 3. Environment Variables



Add your Supabase credentials to `.env.local`:The project uses Supabase for its backend. An environment file `.env.local` is needed.Use the keys you created during the Supabase setup process.



```env### 4. Running the Development Server

# Supabase Configuration

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_urlStart the application in development mode:

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

``````bash

npm run dev

### 3. Supabase Setup```



#### Create Supabase ProjectThe application will be available at `http://localhost:3000`.

1. Go to [supabase.com](https://supabase.com) and create a new project

2. Copy your project URL and anon key to `.env.local`Good luck, engineer! This is your chance to step into the shoes of a security professional and make a real impact on the quality and safety of this application. Happy hunting!


#### Database Schema
Run the following SQL in your Supabase SQL editor:

```sql
-- Create polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL CHECK (length(question) <= 500),
  options JSONB NOT NULL CHECK (jsonb_array_length(options) >= 2 AND jsonb_array_length(options) <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL CHECK (option_index >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id) -- Prevent duplicate votes
);

-- Row Level Security (RLS) Policies
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
CREATE POLICY "Users can create polls" ON polls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view all polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Users can update own polls" ON polls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own polls" ON polls FOR DELETE USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Users can vote on polls" ON votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view all votes" ON votes FOR SELECT USING (true);
```

### 4. Run Development Server

```bash
# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Examples

### Creating a Poll

1. **Register/Login**: Create an account or sign in
2. **Navigate to Create**: Go to `/create` or click "Create Poll"
3. **Fill Form**: 
   - Enter your poll question (max 500 characters)
   - Add 2-10 options (max 200 characters each)
4. **Submit**: Click "Create Poll" to publish

```typescript
// Example: Using the createPoll action
const formData = new FormData();
formData.set('question', 'What is your favorite programming language?');
formData.append('options', 'JavaScript');
formData.append('options', 'TypeScript');
formData.append('options', 'Python');

const result = await createPoll(formData);
if (result.error) {
  console.error('Poll creation failed:', result.error);
} else {
  console.log('Poll created successfully!');
}
```

### Voting on a Poll

1. **Browse Polls**: View available polls on `/polls`
2. **Select Option**: Choose your preferred option
3. **Submit Vote**: Click to submit (one vote per poll per user)

```typescript
// Example: Submitting a vote
const result = await submitVote('poll-uuid-123', 1); // Vote for option at index 1
if (result.error) {
  console.error('Vote failed:', result.error);
} else {
  console.log('Vote submitted successfully!');
}
```

### Managing Your Polls

- **View Your Polls**: Access your dashboard to see created polls
- **Edit Polls**: Update poll questions and options
- **Delete Polls**: Remove polls you no longer need

## 🔧 Development

### Project Structure

```
alx-polly/
├── app/                          # Next.js App Router directory
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (dashboard)/             # Protected dashboard pages
│   │   ├── admin/               # Admin interface
│   │   ├── create/              # Poll creation
│   │   └── polls/               # Poll management
│   ├── components/              # Reusable UI components
│   ├── lib/                     # Utility libraries
│   │   ├── actions/             # Server actions
│   │   ├── context/             # React contexts
│   │   ├── types/               # TypeScript definitions
│   │   └── utils/               # Helper utilities
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Shadcn/ui components
├── lib/                         # Shared utilities
│   └── supabase/                # Supabase configuration
├── public/                      # Static assets
├── docs/                        # Documentation
│   ├── SECURITY_AUDIT_REPORT.md
│   ├── SECURITY_BEST_PRACTICES.md
│   └── API_DOCUMENTATION.md
└── package.json
```

### Key Components

#### Server Actions (`app/lib/actions/`)
- **`auth-actions.ts`**: Authentication functions (login, register, logout)
- **`poll-actions.ts`**: Poll management (create, read, update, delete, vote)

#### React Components (`app/components/`)
- **`PollCreateForm.tsx`**: Dynamic poll creation interface
- **`PollCard.tsx`**: Individual poll display component
- **`Header.tsx`**: Navigation and user menu

#### Utilities (`app/lib/utils/`)
- **`rate-limit.ts`**: Rate limiting for abuse prevention
- **`security-headers.ts`**: Security header configuration

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Database
npm run db:reset     # Reset database schema
npm run db:seed      # Seed with sample data
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 🛡️ Security

ALX Polly has undergone comprehensive security auditing. Key security features include:

### Authentication & Authorization
- ✅ Secure email/password authentication via Supabase
- ✅ User session management with HTTP-only cookies
- ✅ Row Level Security (RLS) policies for data protection
- ✅ User ownership validation for all operations

### Input Validation & Sanitization
- ✅ Server-side validation for all user inputs
- ✅ XSS prevention through input sanitization
- ✅ SQL injection prevention via parameterized queries
- ✅ Length limits and content validation

### Additional Security Measures
- ✅ Rate limiting to prevent abuse
- ✅ CSRF protection via Next.js built-in features
- ✅ Security headers for browser protection
- ✅ UUID validation to prevent injection attacks

For detailed security information, see:
- [Security Audit Report](./SECURITY_AUDIT_REPORT.md)
- [Security Best Practices](./SECURITY_BEST_PRACTICES.md)
- [Implementation Checklist](./SECURITY_IMPLEMENTATION_CHECKLIST.md)

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration with valid email/password
- [ ] User login with correct credentials
- [ ] Session persistence across page refreshes
- [ ] Secure logout functionality

#### Poll Management
- [ ] Create polls with various option counts
- [ ] Edit existing polls (owner only)
- [ ] Delete polls (owner only)
- [ ] View poll results in real-time

#### Voting System
- [ ] Vote on polls (authenticated users only)
- [ ] Prevent duplicate voting
- [ ] Real-time vote count updates
- [ ] Vote validation and error handling

#### Security Testing
- [ ] Attempt to access other users' polls
- [ ] Try submitting invalid form data
- [ ] Test authentication bypass attempts
- [ ] Verify input sanitization

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**:
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Deploy

3. **Configure Environment**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📚 API Reference

### Authentication Actions

#### `login(data: LoginFormData)`
Authenticates user with email and password.

```typescript
const result = await login({
  email: 'user@example.com',
  password: 'password123'
});
```

#### `register(data: RegisterFormData)`
Creates new user account with profile information.

```typescript
const result = await register({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
});
```

### Poll Management Actions

#### `createPoll(formData: FormData)`
Creates a new poll with validation and security checks.

#### `getUserPolls()`
Retrieves all polls owned by the current user.

#### `getPollById(id: string)`
Fetches a specific poll by its UUID.

#### `submitVote(pollId: string, optionIndex: number)`
Submits a vote for a poll option with fraud prevention.

#### `updatePoll(pollId: string, formData: FormData)`
Updates an existing poll (owner only).

#### `deletePoll(id: string)`
Deletes a poll (owner only).

For detailed API documentation, see [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md).

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the coding standards and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow the existing code style and conventions
- Add comprehensive documentation for new functions
- Include inline comments for complex logic
- Ensure all security best practices are followed

### Pull Request Process
1. Update documentation for any new features
2. Add or update tests as needed
3. Ensure the security checklist is followed
4. Request review from maintainers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[ALX Software Engineering Program](https://www.alxafrica.com/)** - For providing the learning framework
- **[Supabase](https://supabase.com/)** - For the excellent backend-as-a-service platform
- **[Vercel](https://vercel.com/)** - For seamless deployment and hosting
- **[Shadcn/ui](https://ui.shadcn.com/)** - For beautiful, accessible UI components

## 📞 Support

- **Documentation**: Check our comprehensive docs in the `/docs` folder
- **Issues**: Report bugs on [GitHub Issues](https://github.com/AlfredMungaMbaru/alx-polly/issues)
- **Security**: For security concerns, see [SECURITY.md](./SECURITY.md)

---

**Built with ❤️ by the ALX Polly team**