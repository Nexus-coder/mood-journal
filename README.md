# 🌙 Mood Journal

A premium, minimalist journaling application designed to help you track your emotional well-being through AI-powered sentiment analysis and real-time trends.

## ✨ Key Features

### 🖋️ AI-Powered Journaling
- **Rich Text Editor**: Integrated [Tiptap 3](https://tiptap.dev/) for a powerful, formatted writing experience with a floating Bubble Menu and JSON-based storage.
- **Midnight Dark Mode**: A premium, high-contrast dark aesthetic optimized for late-night journaling, utilizing semantic CSS variables.
- **Real-time Sentiment**: Integrated AI (OpenAI GPT-4o-mini) analyzes your entries as you write, providing instant feedback on your mood leaning (Positive, Neutral, or Anxious).
- **Automatic Tagging**: The AI automatically generates relevant tags (e.g., #productivity, #anxiety, #growth) for every entry.
- **Full CRUD**: Create, view, edit, and delete your entries with ease.

### 📊 Live Analytics & Trends
- **Mood Trends**: A 7-day heartbeat view in the sidebar showing your writing consistency and emotional shifts.
- **Global Trends Dashboard**:
  - **Sentiment Intensity**: A 30-day area chart tracking your emotional trajectory.
  - **Mood Distribution**: A breakdown of your overall emotional state for the month.
  - **Insight Cards**: Data-driven cards showing your "Peak Productivity" day and writing streaks.

### 🔐 Secure & Personalized
- **Clerk Authentication**: Enterprise-grade security with seamless sign-in/sign-up flows.
- **Convex Backend**: A lightning-fast, real-time database that ensures your journal entries are always in sync across devices.
- **Personalized Summary**: A heuristic-based executive summary on the Trends page that interprets your 30-day data.

## 🏗️ Technical Architecture

The application is built using a modern, scalable monorepo architecture:

### Stack
- **Monorepo Management**: [Turborepo](https://turbo.build/)
- **Frontend**: [Next.js 16.2.3](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/) (Base-Nova style)
- **Database & Backend**: [Convex](https://www.convex.dev/)
- **Encryption & Auth**: [Clerk](https://clerk.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/) with OpenAI
- **Rich Text**: [Tiptap 3](https://tiptap.dev/)
- **Positioning**: [Floating UI](https://floating-ui.com/)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Convex account
- A Clerk account
- An OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mood-journal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` in `apps/web/`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   ```

4. **Initialize Convex**
   In `packages/convex/`:
   ```bash
   npx convex dev
   ```
   *Make sure to set your `OPENAI_API_KEY` in the Convex dashboard settings.*

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

## 🛠️ Folder Structure

- `apps/web`: The Next.js frontend application.
- `packages/convex`: The backend schema, queries, mutations, and AI actions.

## 🗺️ Roadmap / Future Features

We are constantly looking to improve the emotional clarity of our users. Here are some features we plan to implement:

- [ ] **AI Monthly Reflections**: Automated monthly reports that summarize your emotional growth and identify long-term patterns.
- [ ] **Voice Journaling**: Support for voice-to-text journaling for reflections on the go.
- [ ] **Custom Mood Categories**: Allow users to define and color-code their own unique emotional states.
- [ ] **Data Portability**: Features to export your entire history as a beautifully formatted PDF or raw JSON.
- [ ] **Photo Attachments**: The ability to attach a photo to your reflections to capture visual memories.

---

Built with ❤️ for emotional clarity.

