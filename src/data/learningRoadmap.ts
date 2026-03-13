export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

export type Subtopic = {
  id: string;
  title: string;
  content: string;
  chartUrl?: string;
  quiz?: QuizQuestion;
};

export type Topic = {
  id: string;
  title: string;
  subtopics: Subtopic[];
};

export type LessonState = 'locked' | 'start' | 'continue' | 'completed';

export type Lesson = {
  id: string;
  title: string;
  icon: string;
  topics: Topic[];
};

// Initial Roadmap Data
export const initialRoadmap: Lesson[] = [
  {
    id: "lesson-1",
    title: "Lesson 1: Making Money",
    icon: "💰",
    topics: [
      {
        id: "topic-1-1",
        title: "Getting Started With Money",
        subtopics: [
          {
            id: "sub-1-1-1",
            title: "Can you get rich quick?",
            content: "The harsh reality is that getting rich quick is a myth. Sustainable wealth is built through time, discipline, and the power of compounding. Beware of schemes promising guaranteed overnight returns.",
            quiz: {
              id: "q-1-1-1",
              question: "Is 'get rich quick' a realistic financial strategy?",
              options: ["Yes, if you buy the right crypto", "No, it's generally a myth and highly risky", "Yes, day trading guarantees it", "Only for professionals"],
              correctAnswerIndex: 1
            }
          },
          {
            id: "sub-1-1-2",
            title: "Forex, Stocks or Crypto?",
            content: "Each asset class has different risk profiles. Stocks represent company ownership, Crypto is highly volatile digital currency, and Forex is trading global currencies. Beginners should usually start with diversified Stocks or Index Funds.",
            quiz: {
              id: "q-1-1-2",
              question: "Which represents ownership in a real company?",
              options: ["Bitcoin", "US Dollars (Forex)", "Stocks", "Gold"],
              correctAnswerIndex: 2
            }
          },
          {
            id: "sub-1-1-3",
            title: "How much can you make with trading?",
            content: "Trading returns vary wildly. While some make significant profits, most retail traders actually lose money. A realistic expectation for long-term investing (not short-term trading) is historically 10-12% annually in the Indian market.",
            quiz: {
              id: "q-1-1-3",
              question: "What happens to the majority of retail day traders?",
              options: ["They beat the market", "They lose money", "They make steady income", "They become millionaires"],
              correctAnswerIndex: 1
            }
          },
          {
            id: "sub-1-1-4",
            title: "How much are pro traders earning?",
            content: "Institutional 'pro' traders at major firms may manage millions or billions, earning a salary plus performance bonuses. However, their strategies are complex, risk-managed, and backed by immense capital and technology.",
            quiz: {
              id: "q-1-1-4",
              question: "What is a major advantage pro traders have over retail?",
              options: ["Luck", "Magic formulas", "Risk management & massive capital", "They never lose trades"],
              correctAnswerIndex: 2
            }
          },
          {
            id: "sub-1-1-5",
            title: "Trading vs Investing",
            content: "Trading is short-term buying and selling to capture quick price movements. Investing is buying and holding assets for the long term, benefiting from company growth and compounding.",
            chartUrl: "chart-trading-vs-investing",
            quiz: {
              id: "q-1-1-5",
              question: "Which approach generally focuses on the long-term growth of a company?",
              options: ["Day Trading", "Investing", "Swing Trading", "Forex Speculation"],
              correctAnswerIndex: 1
            }
          },
          {
            id: "sub-1-1-6",
            title: "How much money do you need to start?",
            content: "You don't need to be rich to start! You can open a demat account for free and start a Systematic Investment Plan (SIP) in a mutual fund with as little as ₹100 or ₹500 per month.",
            quiz: {
              id: "q-1-1-6",
              question: "What is the minimum amount generally needed to start an SIP in India?",
              options: ["₹10,000", "₹1,00,000", "As little as ₹100 - ₹500", "₹50,000"],
              correctAnswerIndex: 2
            }
          },
          {
            id: "sub-1-1-7",
            title: "9 Pros and Cons of Trading",
            content: "Pros: Potential for high returns, independence, flexibility. Cons: High stress, requires intense focus, massive risk of capital loss, inconsistent income, steep learning curve.",
            quiz: {
              id: "q-1-1-7",
              question: "Which of the following is a 'Con' (negative) of active day trading?",
              options: ["Being your own boss", "High emotional stress", "Working from anywhere", "Potential for profit"],
              correctAnswerIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: "lesson-2",
    title: "Lesson 2: How Markets Work",
    icon: "📈",
    topics: [
      {
        id: "topic-2-1",
        title: "Understanding Financial Markets",
        subtopics: [
          {
            id: "sub-2-1-1",
            title: "4 Trading styles and their costs",
            content: "The 4 main styles are Scalping (seconds/minutes), Day Trading (Intraday), Swing Trading (days/weeks), and Position Trading (months/years). The faster the style, the higher the transaction costs (brokerage, STT).",
            quiz: {
              id: "q-2-1-1",
              question: "Which trading style holds positions for just minutes or seconds?",
              options: ["Position Trading", "Swing Trading", "Day Trading", "Scalping"],
              correctAnswerIndex: 3
            }
          },
          {
            id: "sub-2-1-2",
            title: "Magic asset price correlations",
            content: "Assets often move in relation to one another. For example, historically, when the US Dollar rises, Gold often falls. When interest rates rise, bond prices fall, and highly-leveraged tech stocks may suffer.",
            chartUrl: "chart-correlation",
            quiz: {
              id: "q-2-1-2",
              question: "In general finance theory, what usually happens to bond prices when interest rates rise?",
              options: ["They rise", "They fall", "They stay exactly the same", "They become stocks"],
              correctAnswerIndex: 1
            }
          },
          {
            id: "sub-2-1-3",
            title: "What are CFDs?",
            content: "CFDs (Contracts for Difference) are derivatives where you trade on the price movement of an asset without owning the underlying asset. They allow high leverage but are extremely risky and often banned in certain jurisdictions.",
            quiz: {
              id: "q-2-1-3",
              question: "Do you own the actual stock when you trade a stock CFD?",
              options: ["Yes, in your demat", "No, it's just a contract on price difference", "Yes, but you can't sell it", "Yes, you get voting rights"],
              correctAnswerIndex: 1
            }
          },
          {
            id: "sub-2-1-4",
            title: "Market cycles",
            content: "Markets move in cycles: Accumulation (smart money buys), Markup (trend goes up), Distribution (smart money sells), and Markdown (trend crashes). Recognizing where we are in a cycle is key to survival.",
            chartUrl: "chart-market-cycles",
            quiz: {
              id: "q-2-1-4",
              question: "What is the phase where markets heavily drop in value?",
              options: ["Accumulation", "Markup", "Distribution", "Markdown (Bear Market)"],
              correctAnswerIndex: 3
            }
          }
        ]
      }
    ]
  },
  {
    id: "lesson-3",
    title: "Lesson 3: Advanced Strategies",
    icon: "🚀",
    topics: [
      {
        id: "topic-3-1",
        title: "Technical Analysis",
        subtopics: [
          {
            id: "sub-3-1-1",
            title: "Moving Averages",
            content: "Moving averages smooth out price data to identify trends. The 50-day and 200-day averages are widely tracked by pros.",
            quiz: {
              id: "q-3-1-1",
              question: "What is the main purpose of a moving average?",
              options: ["Prediction of exact tops", "Smoothing out price to see trends", "Calculating taxes", "Buying low automatically"],
              correctAnswerIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: "lesson-4",
    title: "Lesson 4: Risk Management",
    icon: "🛡️",
    topics: [
      {
        id: "topic-4-1",
        title: "The Art of Survival",
        subtopics: [
          {
            id: "sub-4-1-1",
            title: "Stop Losses",
            content: "A stop-loss order automatically sells an asset when it hits a certain price, limiting your potential losses.",
            quiz: {
              id: "q-4-1-1",
              question: "Why use a stop-loss?",
              options: ["To guarantee profit", "To limit potential loss", "To buy more shares", "To avoid brokerage fees"],
              correctAnswerIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: "lesson-6",
    title: "Lesson 6: Trading Strategies",
    icon: "🎯",
    topics: [
      {
        id: "topic-6-1",
        title: "Mastering the Craft",
        subtopics: [
          {
            id: "sub-6-1-1",
            title: "What is a Trading Strategy?",
            content: "A trading strategy is a fixed plan designed to achieve a profitable return by going long or short in markets. It defines entry and exit rules based on data.",
            quiz: {
              id: "q-6-1-1",
              question: "What is the primary purpose of a trading strategy?",
              options: ["To guarantee every trade wins", "To provide a consistent set of rules for entry and exit", "To follow social media trends", "To trade as often as possible"],
              correctAnswerIndex: 1
            }
          },
          {
            id: "sub-6-1-2",
            title: "Trading Styles: Scalping & Day Trading",
            content: "Scalping involves hundreds of trades a day for tiny profits. Day trading involves closing all positions before the market close.",
            quiz: {
              id: "q-6-1-2",
              question: "Which style involves closing all trades before the day ends?",
              options: ["Position Trading", "Swing Trading", "Day Trading", "Investing"],
              correctAnswerIndex: 2
            }
          },
          {
            id: "sub-6-1-3",
            title: "Breakout & Reversal Strategies",
            content: "Breakout traders enter when price moves beyond a defined level. Reversal traders look for signs that a trend is ending.",
            quiz: {
              id: "q-6-1-3",
              question: "Entering a trade when price breaks above a resistance level is called:",
              options: ["Range Trading", "Breakout Trading", "Scalping", "Pullback Trading"],
              correctAnswerIndex: 1
            }
          }
        ]
      }
    ]
  },
  {
    id: "lesson-7",
    title: "Lesson 7: Risk Management",
    icon: "🛡️",
    topics: [
      {
        id: "topic-7-1",
        title: "The Art of Preservation",
        subtopics: [
          {
            id: "sub-7-1-1",
            title: "Why Risk Management is Important",
            content: "Without risk management, one bad trade can wipe out your entire account. It is the single most important skill in trading.",
            quiz: {
              id: "q-7-1-1",
              question: "What is the main goal of risk management?",
              options: ["To make more money", "To avoid all losses", "To ensure survival and preserve capital", "To trade more frequently"],
              correctAnswerIndex: 2
            }
          },
          {
            id: "sub-7-1-2",
            title: "Position Sizing & Stop Loss",
            content: "Position sizing determines how many units you buy. A Stop Loss is your 'get out' price if you are wrong.",
            quiz: {
              id: "q-7-1-2",
              question: "Which tool automatically closes a losing trade at a pre-set level?",
              options: ["Take Profit", "Position Size", "Stop Loss", "Market Order"],
              correctAnswerIndex: 2
            }
          }
        ]
      }
    ]
  },
  {
    id: "lesson-8",
    title: "Lesson 8: Chart Patterns (Advanced)",
    icon: "📊",
    topics: [
      {
        id: "topic-8-1",
        title: "Visualizing Psychology",
        subtopics: [
          {
            id: "sub-8-1-1",
            title: "Reversal: Head and Shoulders",
            content: "A Head and Shoulders pattern indicates a major reversal from a bull trend to a bear trend.",
            quiz: {
              id: "q-8-1-1",
              question: "What type of pattern is 'Head and Shoulders'?",
              options: ["Continuation", "Neutral", "Reversal", "Random"],
              correctAnswerIndex: 2
            }
          },
          {
            id: "sub-8-1-2",
            title: "Flags & Pennants",
            content: "Flags and Pennants are short-term continuation patterns that form after a sharp price move.",
            quiz: {
              id: "q-8-1-2",
              question: "Flags and Pennants are generally what type of patterns?",
              options: ["Reversal", "Continuation", "Stagnation", "Volatile"],
              correctAnswerIndex: 1
            }
          }
        ]
      }
    ]
  }
];
