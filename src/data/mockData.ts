// Mock Quiz Questions
export const quizQuestions = [
  { id: 1, topic: "Investing", question: "What does P/E ratio stand for?", options: ["Price to Earnings", "Profit to Expense", "Price to Equity", "Profit to Earnings"], correct: 0, difficulty: "Easy" },
  { id: 2, topic: "Stock Markets", question: "What is SENSEX?", options: ["BSE's benchmark index", "NSE's benchmark index", "A mutual fund", "A type of bond"], correct: 0, difficulty: "Easy" },
  { id: 3, topic: "Budgeting", question: "The 50/30/20 rule allocates 50% to:", options: ["Wants", "Needs", "Savings", "Investments"], correct: 1, difficulty: "Easy" },
  { id: 4, topic: "Mutual Funds", question: "What is an SIP?", options: ["Single Investment Plan", "Systematic Investment Plan", "Standard Investment Protocol", "Savings Interest Plan"], correct: 1, difficulty: "Easy" },
  { id: 5, topic: "Taxes", question: "What is the Section 80C deduction limit?", options: ["₹1,00,000", "₹1,50,000", "₹2,00,000", "₹2,50,000"], correct: 1, difficulty: "Medium" },
  { id: 6, topic: "Investing", question: "What does NAV stand for in mutual funds?", options: ["Net Asset Value", "National Average Value", "Net Annual Variance", "Nominal Asset Value"], correct: 0, difficulty: "Medium" },
  { id: 7, topic: "Stock Markets", question: "What is a bull market?", options: ["Declining market", "Rising market", "Stable market", "Volatile market"], correct: 1, difficulty: "Easy" },
  { id: 8, topic: "Personal Finance", question: "What is an emergency fund typically?", options: ["1 month expenses", "3-6 months expenses", "1 year expenses", "2 years expenses"], correct: 1, difficulty: "Easy" },
  { id: 9, topic: "Crypto", question: "What technology underlies Bitcoin?", options: ["Cloud computing", "Blockchain", "AI", "Machine Learning"], correct: 1, difficulty: "Easy" },
  { id: 10, topic: "Investing", question: "What is diversification?", options: ["Investing in one stock", "Spreading investments across assets", "Day trading", "Short selling"], correct: 1, difficulty: "Easy" },
  { id: 11, topic: "Stock Markets", question: "What is NIFTY 50?", options: ["BSE index", "NSE benchmark index", "A mutual fund", "A stock"], correct: 1, difficulty: "Easy" },
  { id: 12, topic: "Mutual Funds", question: "ELSS funds have a lock-in of:", options: ["1 year", "2 years", "3 years", "5 years"], correct: 2, difficulty: "Medium" },
  { id: 13, topic: "Taxes", question: "LTCG on equity is taxed at:", options: ["5%", "10%", "15%", "20%"], correct: 1, difficulty: "Hard" },
  { id: 14, topic: "Budgeting", question: "What is zero-based budgeting?", options: ["No budget", "Every rupee assigned a job", "Only saving", "Budget is zero"], correct: 1, difficulty: "Medium" },
  { id: 15, topic: "Personal Finance", question: "What is compound interest?", options: ["Interest on principal only", "Interest on interest", "Fixed interest", "No interest"], correct: 1, difficulty: "Easy" },
  { id: 16, topic: "Stock Markets", question: "What does IPO stand for?", options: ["Initial Private Offering", "Initial Public Offering", "Internal Price Order", "Investment Portfolio Option"], correct: 1, difficulty: "Easy" },
  { id: 17, topic: "Investing", question: "What is a blue-chip stock?", options: ["Penny stock", "Large established company", "New startup", "Foreign stock"], correct: 1, difficulty: "Medium" },
  { id: 18, topic: "Mutual Funds", question: "What is an index fund?", options: ["Actively managed fund", "Tracks a market index", "Debt fund", "Hybrid fund"], correct: 1, difficulty: "Easy" },
  { id: 19, topic: "Taxes", question: "What is TDS?", options: ["Tax Deducted at Source", "Total Deduction System", "Tax Distribution Scheme", "Total Debt Service"], correct: 0, difficulty: "Easy" },
  { id: 20, topic: "Crypto", question: "What is a wallet in crypto?", options: ["Physical wallet", "Digital storage for crypto", "Bank account", "Exchange"], correct: 1, difficulty: "Easy" },
];

// Mock Learning Modules
export const learningModules = [
  {
    id: "budgeting-101",
    category: "Budgeting",
    title: "Budgeting 101: Your First Budget",
    description: "Learn the fundamentals of budgeting and the popular 50/30/20 rule.",
    duration: "15 min",
    xp: 50,
    difficulty: "Beginner",
    content: `## Why Budget?\n\nBudgeting is the foundation of financial health. It helps you understand where your money goes and ensures you're saving for the future.\n\n## The 50/30/20 Rule\n\n- **50% Needs**: Rent, groceries, utilities, EMIs\n- **30% Wants**: Dining out, entertainment, shopping\n- **20% Savings**: Emergency fund, investments, retirement\n\n## Getting Started\n\n1. Track all income sources\n2. List fixed expenses\n3. Categorize variable spending\n4. Set savings goals\n5. Review monthly`,
    completed: false,
    progress: 0,
  },
  {
    id: "investing-basics",
    category: "Investing",
    title: "Introduction to Investing",
    description: "Understand why investing matters and the power of compound interest.",
    duration: "20 min",
    xp: 50,
    difficulty: "Beginner",
    content: `## Why Invest?\n\nInflation erodes purchasing power. Investing helps your money grow faster than inflation.\n\n## Compound Interest\n\nAlbert Einstein called it the eighth wonder of the world. ₹10,000 at 12% annual returns becomes ₹1,74,494 in 25 years!\n\n## Types of Investments\n\n- **Equity**: Stocks, mutual funds\n- **Debt**: FDs, bonds, debt funds\n- **Real Estate**: Property, REITs\n- **Gold**: Physical, digital, SGBs\n\n## Risk vs Return\n\nHigher potential returns = higher risk. Diversification helps manage risk.`,
    completed: false,
    progress: 0,
  },
  {
    id: "stock-market-intro",
    category: "Stock Markets",
    title: "Stock Market Fundamentals",
    description: "Learn how the Indian stock market works — BSE, NSE, SEBI, and more.",
    duration: "25 min",
    xp: 80,
    difficulty: "Beginner",
    content: `## What is a Stock Market?\n\nA marketplace where shares of publicly listed companies are traded.\n\n## Indian Exchanges\n\n- **BSE (Bombay Stock Exchange)**: Asia's oldest, benchmark is SENSEX (30 stocks)\n- **NSE (National Stock Exchange)**: Largest by volume, benchmark is NIFTY 50\n\n## Key Concepts\n\n- **Market Cap**: Share price × total shares\n- **P/E Ratio**: Price ÷ Earnings per share\n- **Dividend**: Company's profit shared with shareholders\n\n## How to Start\n\n1. Open a Demat + Trading account\n2. Complete KYC\n3. Start with blue-chip stocks or index funds`,
    completed: false,
    progress: 0,
  },
  { id: "mf-101", category: "Mutual Funds", title: "Mutual Funds Decoded", description: "SIP, NAV, expense ratio — learn all mutual fund basics.", duration: "20 min", xp: 50, difficulty: "Beginner", completed: false, progress: 0 },
  { id: "tax-saving", category: "Taxes", title: "Tax Saving for Beginners", description: "Section 80C, 80D, HRA — maximize your tax savings legally.", duration: "25 min", xp: 80, difficulty: "Intermediate", completed: false, progress: 0 },
  { id: "personal-finance", category: "Personal Finance", title: "Building an Emergency Fund", description: "Why you need 3-6 months of expenses saved and how to build it.", duration: "15 min", xp: 50, difficulty: "Beginner", completed: false, progress: 0 },
  { id: "crypto-basics", category: "Crypto Basics", title: "Cryptocurrency 101", description: "Blockchain, Bitcoin, and digital assets explained simply.", duration: "20 min", xp: 50, difficulty: "Beginner", completed: false, progress: 0 },
  { id: "advanced-investing", category: "Investing", title: "Value vs Growth Investing", description: "Two classic investing philosophies and when to use each.", duration: "30 min", xp: 100, difficulty: "Advanced", completed: false, progress: 0 },
  { id: "market-analysis", category: "Stock Markets", title: "Technical Analysis Basics", description: "Charts, patterns, and indicators for stock analysis.", duration: "35 min", xp: 100, difficulty: "Advanced", completed: false, progress: 0 },
  { id: "debt-instruments", category: "Investing", title: "Understanding Bonds & FDs", description: "Fixed income instruments and how they fit in your portfolio.", duration: "20 min", xp: 50, difficulty: "Intermediate", completed: false, progress: 0 },
];

// Mock Stocks
const generatePriceHistory = (base: number, volatility: number) => {
  const prices = [];
  let price = base;
  for (let i = 0; i < 30; i++) {
    price = price + (Math.random() - 0.48) * volatility;
    price = Math.max(price * 0.8, price);
    prices.push({ day: i + 1, price: Math.round(price * 100) / 100 });
  }
  return prices;
};

export const mockStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", price: 2456.30, change: 1.2, priceHistory: generatePriceHistory(2400, 30) },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", price: 3890.50, change: -0.8, priceHistory: generatePriceHistory(3850, 40) },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1654.20, change: 0.5, priceHistory: generatePriceHistory(1620, 20) },
  { symbol: "INFY", name: "Infosys", sector: "IT", price: 1520.75, change: 2.1, priceHistory: generatePriceHistory(1480, 25) },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1089.40, change: -0.3, priceHistory: generatePriceHistory(1070, 15) },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", price: 2534.90, change: 0.7, priceHistory: generatePriceHistory(2500, 25) },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking", price: 625.30, change: 1.5, priceHistory: generatePriceHistory(610, 10) },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", price: 1456.80, change: -1.2, priceHistory: generatePriceHistory(1430, 20) },
  { symbol: "ITC", name: "ITC Limited", sector: "FMCG", price: 445.60, change: 0.9, priceHistory: generatePriceHistory(440, 8) },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", price: 1798.25, change: 0.3, priceHistory: generatePriceHistory(1780, 22) },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure", price: 3245.70, change: -0.5, priceHistory: generatePriceHistory(3200, 35) },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking", price: 1123.45, change: 1.8, priceHistory: generatePriceHistory(1100, 15) },
  { symbol: "WIPRO", name: "Wipro", sector: "IT", price: 456.30, change: -1.5, priceHistory: generatePriceHistory(450, 8) },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "Finance", price: 6890.20, change: 2.3, priceHistory: generatePriceHistory(6800, 70) },
  { symbol: "MARUTI", name: "Maruti Suzuki", sector: "Auto", price: 10234.50, change: 0.4, priceHistory: generatePriceHistory(10100, 100) },
  { symbol: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", price: 1567.80, change: -0.7, priceHistory: generatePriceHistory(1550, 18) },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", price: 645.90, change: 3.1, priceHistory: generatePriceHistory(630, 12) },
  { symbol: "ASIANPAINT", name: "Asian Paints", sector: "Consumer", price: 2876.40, change: -0.2, priceHistory: generatePriceHistory(2850, 30) },
  { symbol: "TITAN", name: "Titan Company", sector: "Consumer", price: 3456.70, change: 1.4, priceHistory: generatePriceHistory(3400, 35) },
  { symbol: "NESTLEIND", name: "Nestle India", sector: "FMCG", price: 2345.60, change: 0.6, priceHistory: generatePriceHistory(2320, 25) },
];

// Mock Leaderboard Users
export const leaderboardUsers = [
  { rank: 1, name: "Arjun Mehta", city: "Mumbai", xp: 12450, badges: 15, gamesPlayed: 89, avatar: "AM" },
  { rank: 2, name: "Priya Sharma", city: "Delhi", xp: 11200, badges: 13, gamesPlayed: 76, avatar: "PS" },
  { rank: 3, name: "Rahul Verma", city: "Bangalore", xp: 10890, badges: 12, gamesPlayed: 82, avatar: "RV" },
  { rank: 4, name: "Sneha Patel", city: "Ahmedabad", xp: 9650, badges: 11, gamesPlayed: 65, avatar: "SP" },
  { rank: 5, name: "Vikram Singh", city: "Jaipur", xp: 8900, badges: 10, gamesPlayed: 71, avatar: "VS" },
  { rank: 6, name: "Ananya Reddy", city: "Hyderabad", xp: 8340, badges: 9, gamesPlayed: 58, avatar: "AR" },
  { rank: 7, name: "Karthik Nair", city: "Chennai", xp: 7800, badges: 8, gamesPlayed: 62, avatar: "KN" },
  { rank: 8, name: "Deepika Joshi", city: "Pune", xp: 7200, badges: 8, gamesPlayed: 54, avatar: "DJ" },
  { rank: 9, name: "Amit Kumar", city: "Kolkata", xp: 6900, badges: 7, gamesPlayed: 49, avatar: "AK" },
  { rank: 10, name: "Riya Gupta", city: "Lucknow", xp: 6500, badges: 7, gamesPlayed: 45, avatar: "RG" },
];

// Badge Definitions
export const badges = [
  { id: "first-login", name: "Welcome Aboard", description: "Log in for the first time", icon: "🚀", rarity: "Common" as const, earned: true },
  { id: "streak-7", name: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", rarity: "Rare" as const, earned: true },
  { id: "streak-30", name: "Monthly Master", description: "Maintain a 30-day streak", icon: "⚡", rarity: "Epic" as const, earned: false },
  { id: "first-win", name: "First Victory", description: "Win your first game", icon: "🏆", rarity: "Common" as const, earned: true },
  { id: "rank-1", name: "Champion", description: "Reach #1 on leaderboard", icon: "👑", rarity: "Legendary" as const, earned: false },
  { id: "category-complete", name: "Subject Expert", description: "Complete all modules in a category", icon: "📚", rarity: "Epic" as const, earned: false },
  { id: "trivia-perfect", name: "Perfect Score", description: "Get 10/10 in Financial Trivia", icon: "💯", rarity: "Rare" as const, earned: false },
  { id: "portfolio-pro", name: "Portfolio Pro", description: "Achieve 20%+ returns in Stock Simulator", icon: "📈", rarity: "Legendary" as const, earned: false },
];

// Competitions
export const competitions = [
  {
    id: "weekly-trivia-1",
    name: "Weekly Finance Quiz",
    gameType: "Financial Trivia",
    startDate: "2026-03-16T18:00:00",
    endDate: "2026-03-16T19:00:00",
    prize: "500 XP + Rare Badge",
    entryCount: 234,
    status: "upcoming" as const,
  },
  {
    id: "stock-challenge",
    name: "Stock Trading Championship",
    gameType: "Stock Market Simulator",
    startDate: "2026-03-20T10:00:00",
    endDate: "2026-03-22T18:00:00",
    prize: "1000 XP + Epic Badge",
    entryCount: 156,
    status: "upcoming" as const,
  },
];

// XP Level Thresholds
export const levelThresholds = [
  { level: 1, minXP: 0, maxXP: 500, title: "Novice" },
  { level: 2, minXP: 500, maxXP: 1500, title: "Learner" },
  { level: 3, minXP: 1500, maxXP: 3500, title: "Practitioner" },
  { level: 4, minXP: 3500, maxXP: 6000, title: "Expert" },
  { level: 5, minXP: 6000, maxXP: 10000, title: "Master" },
  { level: 6, minXP: 10000, maxXP: 15000, title: "Grandmaster" },
  { level: 7, minXP: 15000, maxXP: Infinity, title: "Legend" },
];

export const getUserLevel = (xp: number) => {
  return levelThresholds.find(l => xp >= l.minXP && xp < l.maxXP) || levelThresholds[0];
};

// Mock current user
export const currentUser = {
  name: "Aarav Patel",
  email: "aarav@example.com",
  avatar: "AP",
  xp: 2340,
  streak: 12,
  role: "Student",
  city: "Mumbai",
  joinDate: "2026-01-15",
  gamesPlayed: 34,
  modulesCompleted: 5,
  tournamentsWon: 2,
  rank: 14,
  balance: 50000,
  isPro: false,
};

// Topic categories for learn page
export const topicCategories = [
  { name: "Budgeting", icon: "📊", moduleCount: 3, completed: 1, color: "common" },
  { name: "Investing", icon: "📈", moduleCount: 3, completed: 0, color: "rare" },
  { name: "Stock Markets", icon: "🏛️", moduleCount: 2, completed: 0, color: "epic" },
  { name: "Mutual Funds", icon: "🎯", moduleCount: 1, completed: 0, color: "rare" },
  { name: "Taxes", icon: "🧾", moduleCount: 1, completed: 0, color: "common" },
  { name: "Personal Finance", icon: "💰", moduleCount: 1, completed: 0, color: "common" },
  { name: "Crypto Basics", icon: "🪙", moduleCount: 1, completed: 0, color: "legendary" },
];
