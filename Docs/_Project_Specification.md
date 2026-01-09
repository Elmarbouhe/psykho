Project: AllPsycho AI Psychologist (MVP)

1. Project Overview

A web application that acts as an AI-powered psychological companion based on Alfred Adler's "Individual Psychology." It focuses on goal-oriented dialogue, tracking "Life Tasks" (Work, Love, Friendship), and identifying "Private Logic" (biased beliefs).

**Design System: "The Sanctuary"**
- **Aesthetic**: Calm, sophisticated Sage Green and Soft Forest Earth tones.
- **Reference**: Detailed guidelines in [UI_Style_Guide.md](file:///Users/yahiaelmarbouh/yahyaWork/training/psykho/Docs/UI_Style_Guide.md).
- **Micro-interactions**: Smooth transitions and animated ambient orbs powered by `framer-motion`.
- **Modes**: Deep earthy dark mode and warm neutral light mode.

2. Tech Stack & Architecture

Framework: Next.js 14+ (App Router)

Language: TypeScript

UI Component Library: shadcn/ui + Tailwind CSS

Authentication: Firebase Auth (Client-side SDK + Server-side verification)

Database: PostgreSQL (Neon via Prisma ORM with `@prisma/adapter-neon`)

AI Provider: Google Gemini API (gemini-2.5-flash)

Architecture: Clean Architecture / Feature-based

/app: Next.js pages and API routes

/components: UI components (Atoms/Molecules)

/lib: Helper functions

/services: Business logic (AI service, DB service) separated from UI.

3. Core Features (MVP Scope)

Feature A: Authentication & Onboarding

User Story: "As a user, I want to sign up securely so my psychological data is private."

Implementation:

Login/Register page using Firebase Auth (Google + Email/Password).

On first login, create a record in PostgreSQL users table using the Firebase uid.

Feature B: "The Sanctuary" (Home Dashboard)

User Story: "As a user, I want to log my current mood and receive a quick, personalized reflection."

Functionality:

Mood Selector: 4 main states (Joyful, Calm, Sad, Anxious).

Daily Insight Generator: When a mood is selected, call Gemini API to generate a 1-sentence AllPsycho reflection and a 5-minute action.

Data Persistence: Save the mood entry and the generated insight to the daily_logs table in Postgres.

Visual Feedback: Display the "Plant" component. (Logic: If the user has logged in 3 days in a row, show the plant as "Blooming"; otherwise, "Growing").

Feature C: "The Dialogue" (AllPsycho Chat)

User Story: "As a user, I want to chat with an AI that helps me uncover the purpose of my emotions."

Functionality:

Chat Interface: Standard chat UI (User bubbles right, AI bubbles left).

AllPsycho System Prompt: The AI must be instructed to focus on Teleology (Purpose of behavior) and Social Interest. It must NOT diagnose.

Context Awareness: The chat should load the last 10 messages from the chat_messages table for context.

Streaming: (Optional for MVP) Display text as it generates.

Feature D: "The Mirror" (Insights Dashboard)

User Story: "As a user, I want to see my progress in the three Life Tasks (Work, Love, Friendship)."

Functionality:

Session Summarization (Background Job): After a chat session ends (or user clicks "Analyze"), send the chat transcript to Gemini.

Extraction Prompt: Ask Gemini to:

Rate "Social Interest" in Work, Love, and Friendship (0-100).

Identify one "Private Logic" statement (e.g., "I must be perfect").

Display: Render these scores as progress bars and the text as a "Insight Card".

Storage: Save to insights table.

4. Database Schema (PostgreSQL)

### users
- **id** (String, PK): Matches Firebase UID
- **email** (String, Optional): To support all Firebase Auth methods
- **name** (String?)
- **age** (Int?)
- **occupation** (String?)
- **current_goal** (String?): User's focus (e.g., "Reduce Anxiety")
- **safe_space** (Text?): Description for visualization exercises
- **created_at** (Timestamp)
- **updated_at** (Timestamp)

### daily_logs
- **id** (UUID, PK)
- **user_id** (FK -> users.id)
- **mood** (Enum): 'JOYFUL', 'CALM', 'SAD', 'ANXIOUS'
- **ai_reflection** (Text)
- **created_at** (Timestamp)

### chat_sessions
- **id** (UUID, PK)
- **user_id** (FK -> users.id)
- **summary** (Text?)
- **created_at** (Timestamp)
- **updated_at** (Timestamp)

### chat_messages
- **id** (UUID, PK)
- **session_id** (FK -> chat_sessions.id)
- **sender** (Enum): 'USER' or 'AI'
- **content** (Text)
- **created_at** (Timestamp)
- **Performance**: Composite index on `(session_id, created_at)` for fast retrieval.

### user_insights
- **id** (UUID, PK)
- **user_id** (FK -> users.id)
- **work_score** (Int)
- **love_score** (Int)
- **friendship_score** (Int)
- **detected_private_logic** (Text)
- **created_at** (Timestamp)
- **updated_at** (Timestamp)

---

### Critical Safeguards & Recommendations

> [!IMPORTANT]
> **Firebase-to-Postgres Synchronization**
> To ensure consistency between Firebase Auth and PostgreSQL:
> 1. **Server-Side Creation**: When a user signs up on the frontend, trigger a server-side action (Next.js API route or Firebase Cloud Function) to create the User row in Prisma immediately.
> 2. **Reliability**: Do not rely solely on the client-side to create the user record, as network failures or browser security settings can lead to "missing user" records in the database.

> [!TIP]
> **Auth Edge Cases**
> The `email` field is marked as optional to support authentication methods that may not provide an email (e.g., Apple's "Hide My Email" or Anonymous logins).

5. API Routes (Next.js)

### Authentication & Sync
**POST /api/auth/sync**
- **Purpose**: Synchronizes Firebase User (Google or Email) with PostgreSQL.
- **Architecture**:
    - **Controller**: `src/app/api/auth/sync/route.ts` (Handles request/response)
    - **Service**: `src/services/auth-service.ts` (Business logic: Verify Token -> Upsert User)
    - **Infrastructure**: `src/lib/firebase/admin.ts` (Firebase Admin SDK)

### User Profile
**GET /api/profile**
- **Purpose**: Fetch the current authenticated user's metadata.

**POST /api/profile**
- **Purpose**: Update user's name, age, occupation, current goal, and safe space description.
- **Service**: `src/services/profile-service.ts`

6. Frontend Architecture (React/Next.js)

### Authentication (Clean Architecture)
- **Infrastructure**: `shadcn/ui` (Components), `firebase/auth` (SDK).
- **Service Layer**: `src/services/client-auth-service.ts`
    - Wraps `signInWithPopup`, `createUserWithEmailAndPassword`, and `signInWithEmailAndPassword`.
    - Handles the backend sync API call.
- **State Management**: `src/components/providers/auth-provider.tsx`
    - Global `AuthContext` providing `user`, `login`, `loginWithEmail`, `register`, `logout`.
- **Presentation**:
    - **Layout**: `src/app/(auth)/layout.tsx` (Premium "Sanctuary" theme with `framer-motion`).
    - **Pages**: 
        - `src/app/(auth)/login/page.tsx` (Login UI).
        - `src/app/(auth)/register/page.tsx` (Registration UI).
        - `src/app/(app)/dashboard/page.tsx` (Main Dashboard).
        - `src/app/(app)/profile/page.tsx` (Profile Management at `/profile`).

### Route Protection
- **Strategy**: Shared route group layout wrapping (`src/app/(app)/layout.tsx`).
- **Behavior**: Redirects unauthenticated users to `/login`.

7. API Routes (Next.js)

POST /api/daily-checkin: Handles mood logging + generating daily insight.

POST /api/analyze-session: Triggers the summarization of a chat to update Life Task scores.