Project: AllPsycho AI Psychologist (MVP)

1. Project Overview

A web application that acts as an AI-powered psychological companion based on Alfred Adler's "Individual Psychology." It focuses on goal-oriented dialogue, tracking "Life Tasks" (Work, Love, Friendship), and identifying "Private Logic" (biased beliefs).

2. Tech Stack & Architecture

Framework: Next.js 14+ (App Router)

Language: TypeScript

UI Component Library: shadcn/ui + Tailwind CSS

Authentication: Firebase Auth (Client-side SDK + Server-side verification)

Database: PostgreSQL (via Prisma ORM)

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

users

id (String, PK): Matches Firebase UID

email (String)

created_at (Timestamp)

daily_logs

id (UUID, PK)

user_id (FK -> users.id)

mood (String): 'Joyful', 'Calm', 'Sad', 'Anxious'

ai_reflection (Text)

created_at (Timestamp)

chat_sessions

id (UUID, PK)

user_id (FK -> users.id)

summary (Text)

created_at (Timestamp)

chat_messages

id (UUID, PK)

session_id (FK -> chat_sessions.id)

sender (String): 'user' or 'ai'

content (Text)

created_at (Timestamp)

user_insights

id (UUID, PK)

user_id (FK -> users.id)

work_score (Int)

love_score (Int)

friendship_score (Int)

detected_private_logic (Text)

created_at (Timestamp)

5. API Routes (Next.js)

POST /api/chat: Handles sending message to Gemini + saving to DB.

POST /api/daily-checkin: Handles mood logging + generating daily insight.

POST /api/analyze-session: Triggers the summarization of a chat to update Life Task scores.

GET /api/user/insights: Fetches data for the "Mirror" dashboard.