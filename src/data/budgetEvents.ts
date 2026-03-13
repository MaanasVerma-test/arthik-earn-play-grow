export interface Choice {
    id: string;
    text: string;
    cost: number;
    happinessImpact: number;
    description: string;
  }
  
  export interface BudgetEvent {
    id: string;
    title: string;
    description: string;
    type: 'fixed' | 'random';
    choices: Choice[];
  }
  
  export const INITIAL_SALARY = 50000;
  export const FIXED_EXPENSES = 25000; // Rent, utilities, basic groceries
  export const INITIAL_HAPPINESS = 80; // Out of 100
  export const INITIAL_SAVINGS = 20000;
  export const WINNING_XP = 150;
  
  export const fixedMonthlyEvent: BudgetEvent = {
    id: 'monthly_fixed',
    title: 'Monthly Expenses',
    description: 'Rent, electricity, internet, and basic groceries are due.',
    type: 'fixed',
    choices: [
      {
        id: 'pay_standard',
        text: 'Pay Standard Bills',
        cost: FIXED_EXPENSES,
        happinessImpact: 0,
        description: 'You paid your necessary living expenses.'
      },
      {
         id: 'pay_luxury',
         text: 'Upgrade Lifestyle',
         cost: FIXED_EXPENSES + 10000,
         happinessImpact: 10,
         description: 'You paid bills but also upgraded your internet and bought premium groceries.'
      },
      {
          id: 'pay_frugal',
          text: 'Cut Corners (Frugal)',
          cost: FIXED_EXPENSES - 5000,
          happinessImpact: -15,
          description: 'You skipped heating/AC and ate only instant noodles to save money.'
       }
    ]
  };
  
  export const randomEvents: BudgetEvent[] = [
    {
      id: 'event_wedding',
      title: 'Friend\'s Destination Wedding',
      description: 'Your close friend invited you to a destination wedding in Goa.',
      type: 'random',
      choices: [
        { id: 'attend_luxury', text: 'Go all out (Flights & Hotel)', cost: 25000, happinessImpact: 20, description: 'You had the time of your life, but your wallet is crying.' },
        { id: 'attend_budget', text: 'Go on a budget (Train & Hostel)', cost: 10000, happinessImpact: 10, description: 'You made it to the wedding and saved some money, though the train ride was exhausting.' },
        { id: 'decline', text: 'Send a gift and skip', cost: 2000, happinessImpact: -10, description: 'You saved a lot of money, but your friend missed you and you feel left out.' }
      ]
    },
    {
      id: 'event_medical',
      title: 'Unexpected Medical Bill',
      description: 'You had a terrible toothache and needed an emergency root canal.',
      type: 'random',
      choices: [
        { id: 'pay_cash', text: 'Pay out of pocket', cost: 15000, happinessImpact: -5, description: 'Your tooth is fixed, but your savings took a direct hit.' },
        { id: 'use_insurance', text: 'Use limited insurance + copay', cost: 3000, happinessImpact: -2, description: 'Good thing you remembered your dental cover! Your tooth is fixed for cheap.' },
        { id: 'delay', text: 'Ignore the pain', cost: 0, happinessImpact: -25, description: 'You saved money, but you cannot sleep or eat properly. Your happiness has tanked.' }
      ]
    },
    {
      id: 'event_bonus',
      title: 'Performance Bonus!',
      description: 'Your boss recognized your hard work and gave you a spot bonus of ₹20,000.',
      type: 'random',
      choices: [
        { id: 'save_all', text: 'Stash it in savings', cost: -20000, happinessImpact: 5, description: 'A responsible choice. You feel secure.' },
        { id: 'buy_gadget', text: 'Buy that new phone', cost: 0, happinessImpact: 25, description: 'You spent the entire bonus on a phone. Money is gone, but you are thrilled.' },
        { id: 'split', text: 'Save half, treat yourself', cost: -10000, happinessImpact: 15, description: 'A balanced approach. You grew your wealth and had a nice dinner.' }
      ]
    },
    {
      id: 'event_appliance',
      title: 'Broken Refrigerator',
      description: 'Your fridge died overnight. All your food is spoiling.',
      type: 'random',
      choices: [
        { id: 'buy_new', text: 'Buy a brand new smart fridge', cost: 45000, happinessImpact: 15, description: 'Your kitchen looks great and you have ice on demand. Huge expense though.' },
        { id: 'buy_used', text: 'Buy a second-hand fridge', cost: 12000, happinessImpact: -5, description: 'It hums loudly, but it keeps the food cold and saved you ₹33k.' },
        { id: 'repair', text: 'Call a mechanic to fix it', cost: 4000, happinessImpact: 0, description: 'It took two days of stress, but it works again for relatively cheap.' }
      ]
    },
    {
      id: 'event_sale',
      title: 'Massive Online Sale',
      description: 'Your favorite brand is having a 70% off clearance sale.',
      type: 'random',
      choices: [
        { id: 'splurge', text: 'Revamp your wardrobe', cost: 15000, happinessImpact: 15, description: 'You look fabulous, but was it a need or a want?' },
        { id: 'moderate', text: 'Buy just one nice shirt', cost: 2500, happinessImpact: 5, description: 'You satisfied the craving without breaking the bank.' },
        { id: 'close_app', text: 'Close the app immediately', cost: 0, happinessImpact: -5, description: 'Discipline hurts in the moment, but pays off later.' }
      ]
    },
    {
        id: 'event_investment',
        title: 'Hot Stock Tip',
        description: 'A coworker insists you should buy shares of "MemeCorp".',
        type: 'random',
        choices: [
          { id: 'invest_heavy', text: 'Invest ₹25,000', cost: 25000, happinessImpact: -15, description: 'MemeCorp crashed the next day. You lost the money.' }, // We simplify investments as instant outcomes here for game flow
          { id: 'invest_light', text: 'Invest ₹5,000 just in case', cost: 5000, happinessImpact: -5, description: 'MemeCorp crashed. You lost ₹5k, but glad it wasn\'t more.' },
          { id: 'ignore', text: 'Stick to index funds (Ignore)', cost: 0, happinessImpact: 5, description: 'MemeCorp crashed. You feel smug about your responsible investing.' }
        ]
      },
      {
        id: 'event_friends',
        title: 'Weekend Trip with Friends',
        description: 'Friends are planning a spontaneous road trip to the mountains.',
        type: 'random',
        choices: [
          { id: 'say_yes', text: 'Say yes and pitch in', cost: 8000, happinessImpact: 20, description: 'You created memories that will last a lifetime.' },
          { id: 'host_instead', text: 'Host a movie night instead', cost: 1500, happinessImpact: 10, description: 'You convinced them to stay in. Fun, cheap, but not quite a mountain view.' },
          { id: 'stay_home', text: 'Stay home to work', cost: 0, happinessImpact: -15, description: 'You saved money but spent the weekend watching their Instagram stories.' }
        ]
      }
  ];
  
  export const getRandomEvent = (excludeIds: string[] = []): BudgetEvent => {
    const available = randomEvents.filter(e => !excludeIds.includes(e.id));
    // If we run out of unique events, reset the pool (though we have 7 for 12 months, we might repeat or we can add more)
    const pool = available.length > 0 ? available : randomEvents;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  };
