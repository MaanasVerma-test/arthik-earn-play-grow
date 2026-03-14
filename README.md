# ✨ Arthik (अर्थीक)

### **Earn. Play. Grow.**

> A gamified financial literacy platform that makes learning about money fun, interactive, and deeply personalized — powered by AI.

🌐 **Live Demo**: [https://arthik-earn-play-grow.vercel.app/](https://arthik-earn-play-grow.vercel.app/)

---

## 🚀 Key Features

### 📚 Gamified Learning Path
- **8 Interactive Lessons** covering Budgeting, Markets, Investing, Psychology, Trading Strategies, Risk Management, and Advanced Chart Patterns.
- **Duolingo-style Roadmap** — a vertical, node-based visual flow connecting all lessons.
- **Quizzes & XP** — Earn experience points by completing lessons and quizzes.
- **Confetti Celebrations** on completion for a delightful UX.

### 📈 Stock Market Simulator
- Trade with **virtual ₹1,00,000** using real-time stock quotes from Yahoo Finance.
- **Candlestick & Line Chart Toggle** — switch between chart styles with a dropdown.
- **Time Range Filters** — View data across 1D, 5D, 15D, 1M, 5M, 1Y.
- **Live Market Data Badge** — Indicates when quotes are live vs. simulated.
- Built with **ApexCharts** for professional-grade financial visualizations.

### 🤖 AI Budget & Roadmap Builder (Powered by Google Gemini)
- Enter your **Age**, **Monthly Earnings**, **Field of Work**, **Expected Salary Growth**, and **Ultimate Financial Ambition** (e.g., "Buy a flat in Burj Khalifa").
- The AI analyzes your profile and generates:
  - 💰 **Monthly Savings Split** — Goal savings, Emergency Fund, Miscellaneous/Living.
  - 🔴 **Stress / Difficulty Meter** — Scored 1–10 with color-coded severity.
  - 📊 **Portfolio Allocation** — Donut chart + exact ₹ amounts for Equity, Debt, Gold, Cash.
  - 📈 **Wealth Growth Projection** — An area chart showing projected wealth at every age until goal completion.
  - 🗺️ **Step-by-Step Roadmap** — Year-by-year milestones with actionable advice.

### 🎮 Mini-Games
- **Trivia Hub** — Test your financial IQ with curated quizzes.
- **Bid Bonanza** — Evaluate startup valuations and place competitive bids.
- **Budget Challenge** — Allocate a monthly budget and make tradeoff decisions.
- **Portfolio Builder** — Construct an investment portfolio and see how it performs.

### ⚔️ Compete Mode
- **1v1 Arena** — Challenge other players in real-time financial quizzes.
- **Global Leaderboards** — Climb the ranks based on XP earned across all activities.

### 👤 User Profile & Authentication
- **Supabase Auth** integration for login/signup.
- **XP Tracking** & **Streak Counter** displayed in the navigation bar.
- **PRO Badge** support for premium users.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animations** | Framer Motion |
| **Charts** | ApexCharts (Candlestick, Line, Donut, Area) + Recharts |
| **AI** | Google Gemini API (`@google/generative-ai`)|
| **Backend** | Supabase (Auth, Database, Profiles) |
| **State** | TanStack React Query |
| **Icons** | Lucide React |
| **HTTP** | Axios (Yahoo Finance proxy)+Alpha Vantage |
| **Deployment** | Vercel |

---

## 📦 Project Structure

```text
src/
├── components/       # Reusable UI components (layout, landing, learn, ui)
├── data/             # Mock data, learning roadmap content
├── lib/              # Utilities (Supabase client, Gemini AI service, Stock API)
├── pages/            # All page-level views
│   ├── AiBudgetingPage.tsx
│   ├── StockSimulatorPage.tsx
│   ├── LearnPage.tsx
│   ├── DashboardPage.tsx
│   ├── GamesHubPage.tsx
│   └── ...
└── hooks/            # Custom React hooks
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```sh
git clone https://github.com/MaanasVerma-test/arthik-earn-play-grow.git
cd arthik-earn-play-grow
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url (optional)
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key (optional)
```

> Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

### Run Locally

```sh
npm run dev
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |

---

## 🌟 Mission

Our mission is to make financial education **inclusive, accessible, and fun**. Every citizen deserves the tools to manage their wealth and understand the economy.

**Start your journey with Arthik today** → [arthik-earn-play-grow.vercel.app](https://arthik-earn-play-grow.vercel.app/)
