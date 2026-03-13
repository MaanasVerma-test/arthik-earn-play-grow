export type AssetClass = 'Equity' | 'Debt' | 'Gold' | 'RealEstate';

export interface PortfolioAllocation {
  Equity: number;
  Debt: number;
  Gold: number;
  RealEstate: number;
}

export interface SimulationYear {
  year: number;
  value: number;
  Equity: number;
  Debt: number;
  Gold: number;
  RealEstate: number;
}

// Historical approximations for Indian tracking
const ASSET_PROFILES = {
  Equity: { cagr: 0.12, vol: 0.15 },      // 12% avg return, 15% volatility
  Debt: { cagr: 0.07, vol: 0.03 },        // 7% avg return, 3% vol (stable)
  Gold: { cagr: 0.09, vol: 0.12 },        // 9% avg return, 12% vol
  RealEstate: { cagr: 0.10, vol: 0.08 }   // 10% avg return, 8% vol (moderate)
};

/**
 * Generates a normally distributed random number (Box-Muller transform)
 * Used to simulate realistic market returns instead of just straight lines.
 */
function randomNormal(mean: number, stdDev: number): number {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); 
  while(v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}

/**
 * Simulates a portfolio's growth over 10 years based on initial allocation.
 * Assumes no rebalancing for simplicity of the game.
 */
export const simulatePortfolio = (
  initialInvestment: number, 
  allocation: PortfolioAllocation, 
  years: number = 10
): SimulationYear[] => {
  const data: SimulationYear[] = [];
  
  // Starting values
  let currentValues = {
    Equity: initialInvestment * (allocation.Equity / 100),
    Debt: initialInvestment * (allocation.Debt / 100),
    Gold: initialInvestment * (allocation.Gold / 100),
    RealEstate: initialInvestment * (allocation.RealEstate / 100)
  };

  data.push({ 
    year: 0, 
    value: initialInvestment,
    ...currentValues
  });

  for (let i = 1; i <= years; i++) {
    // Generate this year's randomized return for each asset class
    const eRet = randomNormal(ASSET_PROFILES.Equity.cagr, ASSET_PROFILES.Equity.vol);
    const dRet = randomNormal(ASSET_PROFILES.Debt.cagr, ASSET_PROFILES.Debt.vol);
    const gRet = randomNormal(ASSET_PROFILES.Gold.cagr, ASSET_PROFILES.Gold.vol);
    const rRet = randomNormal(ASSET_PROFILES.RealEstate.cagr, ASSET_PROFILES.RealEstate.vol);

    // Apply returns
    currentValues.Equity *= (1 + eRet);
    currentValues.Debt *= (1 + dRet);
    currentValues.Gold *= (1 + gRet);
    currentValues.RealEstate *= (1 + rRet);

    data.push({
      year: i,
      value: currentValues.Equity + currentValues.Debt + currentValues.Gold + currentValues.RealEstate,
      Equity: currentValues.Equity,
      Debt: currentValues.Debt,
      Gold: currentValues.Gold,
      RealEstate: currentValues.RealEstate
    });
  }

  return data;
};

/**
 * Rates the portfolio on a scale of 1-10 and provides feedback.
 */
export const ratePortfolio = (allocation: PortfolioAllocation): { score: number, feedback: string[] } => {
  let score = 10;
  const feedback: string[] = [];
  const { Equity: eq, Debt: deb, Gold: gld, RealEstate: re } = allocation;

  // 1. Check for extreme concentration (100% in one asset)
  if (eq === 100 || deb === 100 || gld === 100 || re === 100) {
    score -= 4;
    feedback.push("⚠️ Zero Diversification: Putting 100% in a single asset exposes you to massive risk if that sector crashes. Never put all your eggs in one basket.");
  }

  // 2. Evaluate Equity vs Horizon (10 years is long term, so equity is good)
  if (eq < 20) {
    score -= 2;
    feedback.push("📉 Too Conservative: For a 10-year horizon, your equity allocation is very low. You might struggle to beat inflation and create real wealth.");
  } else if (eq > 80 && eq !== 100) {
    score -= 1;
    feedback.push("🎢 Highly Aggressive: High equity means high potential returns, but be prepared for heavy volatility and drawdowns during market crashes.");
  } else if (eq >= 40 && eq <= 70) {
    feedback.push("✅ Strong Growth Core: An solid equity allocation provides the engine for long-term wealth compounding.");
  }

  // 3. Evaluate Debt/Safety
  if (deb === 0 && eq > 0) {
    score -= 1;
    feedback.push("⚠️ No Safety Net: You have zero allocation to Debt. You have nothing to cushion your portfolio during severe equity bear markets.");
  } else if (deb > 60 && deb !== 100) {
    score -= 2;
    feedback.push("🐢 Overly Defensive: High debt allocation provides safety, but over 10 years, it severely limits your overall compounding potential.");
  } else if (deb >= 10 && deb <= 40) {
      feedback.push("✅ Risk Managed: Your debt allocation provides a stable safety net to weather market storms.");
  }

  // 4. Gold / Alternative Diversification
  if (gld > 30) {
      score -= 1;
      feedback.push("⚖️ Heavy Gold: Gold is a great inflation hedge, but allocating more than 30% usually drags down overall long-term returns compared to productive assets.");
  } else if (gld >= 5 && gld <= 15) {
      feedback.push("✅ Inflation Hedge: A smart 5-15% Gold allocation acts as a perfect hedge against fiat inflation and market panic.");
  }

  // Ensure score stays within 1-10 bounds
  score = Math.max(1, Math.min(10, score));

  // If perfect score
  if (score === 10) {
      feedback.unshift("🏆 Master Class Allocation: Your portfolio is incredibly well-balanced for a 10-year horizon, maximizing growth while respecting risk!");
  }

  return { score, feedback };
};
