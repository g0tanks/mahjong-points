// Simplified Hong Kong-style scoring rules used by both the
// rules overview and the manual counter flow.

export const CATEGORY_LABELS = {
  small: 'Small hands',
  medium: 'Medium hands',
  big: 'Big hands',
};

export const CATEGORY_ORDER = ['small', 'medium', 'big'];

export const SCORING_RULES = [
  {
    id: 'yourFlowers',
    name: 'Your Flower Tile(s)',
    category: 'small',
    points: 1,
    pointsLabel: '+1',
    description:
      'You have flower or season tiles that match your seat position.',
    beginnerCheckInstructions:
      'East = 1, South = 2, West = 3, North = 4. If any of your flowers or seasons match your seat number, mark Yes. Follow your table house rule if it differs.',
    tileExamples: [
      'Flowers1',
      'Flowers2',
      'Flowers3',
      'Flowers4',
      'Seasons1',
      'Seasons2',
      'Seasons3',
      'Seasons4',
    ],
    type: 'boolean',
    note: 'Flower handling depends on house rules. This sheet awards +1 for matching.',
  },
  {
    id: 'noFlowers',
    name: 'No Flower Tiles',
    category: 'small',
    points: 1,
    pointsLabel: '+1',
    description:
      'You won the hand without having any flower or season bonus tiles.',
    beginnerCheckInstructions:
      'Look at your bonus tile area. If you have zero flowers and zero seasons, mark Yes.',
    tileExamples: [],
    type: 'boolean',
    note: 'Flower handling depends on house rules. This sheet awards +1 for having none.',
  },
  {
    id: 'yourWindPung',
    name: 'Your Wind Pung',
    category: 'small',
    points: 1,
    pointsLabel: '+1',
    description: 'You have a triplet or kong of your own seat wind.',
    beginnerCheckInstructions:
      'A pung is three of the same tile. A kong is four. If you have three or four of your seat wind, mark Yes.',
    tileExamples: ['EastWind', 'EastWind', 'EastWind'],
    type: 'boolean',
  },
  {
    id: 'roundWindPung',
    name: 'Round Wind Pung',
    category: 'small',
    points: 1,
    pointsLabel: '+1',
    description: 'You have a triplet or kong of the current round wind.',
    beginnerCheckInstructions:
      'Check the round indicator at your table. If you have three or four of the round wind, mark Yes.',
    tileExamples: ['SouthWind', 'SouthWind', 'SouthWind'],
    type: 'boolean',
  },
  {
    id: 'dragonPungs',
    name: 'Each Dragon Pung',
    category: 'small',
    points: 1,
    pointsLabel: '+1 each',
    description:
      'You have a triplet or kong of Red, Green, or White dragons. Each dragon set scores separately.',
    beginnerCheckInstructions:
      'Tick every dragon you have as a triplet or kong. Mixed dragons do not count.',
    tileExamples: ['RedDragon', 'GreenDragon', 'WhiteDragon'],
    type: 'multiSelect',
    options: [
      { id: 'red', label: 'Red Dragon Pung', tile: 'RedDragon', points: 1 },
      { id: 'green', label: 'Green Dragon Pung', tile: 'GreenDragon', points: 1 },
      { id: 'white', label: 'White Dragon Pung', tile: 'WhiteDragon', points: 1 },
    ],
  },
  {
    id: 'selfDraw',
    name: 'Self Draw',
    category: 'small',
    points: 1,
    pointsLabel: '+1',
    description:
      "You drew the winning tile yourself instead of winning from another player's discard.",
    beginnerCheckInstructions:
      'Did you complete your hand by picking from the wall? If yes, mark Yes.',
    tileExamples: [],
    type: 'boolean',
  },
  {
    id: 'chickenHand',
    name: 'Chicken Hand',
    category: 'small',
    points: 0,
    pointsLabel: '0',
    description:
      'A basic winning hand with no scoring combinations. It scores 0 points.',
    beginnerCheckInstructions:
      'Only mark this if none of the other scoring rules applied. It adds 0 points but acknowledges the win.',
    tileExamples: [],
    type: 'boolean',
    warnIfWithScoring: true,
  },

  {
    id: 'allEatingOnePair',
    name: 'All Eating, One Pair',
    category: 'medium',
    points: 1,
    pointsLabel: '+1',
    description:
      'Your hand has four sequences (chows) and one pair, with no triplets or kongs.',
    beginnerCheckInstructions:
      'A chow is three consecutive numbers in the same suit, like 4-5-6 of Bamboo. Four chows plus one pair = Yes.',
    tileExamples: ['Bamboo4', 'Bamboo5', 'Bamboo6'],
    exampleHand: [
      { type: 'chow', tiles: ['Bamboo1', 'Bamboo2', 'Bamboo3'] },
      { type: 'chow', tiles: ['Bamboo4', 'Bamboo5', 'Bamboo6'] },
      { type: 'chow', tiles: ['Circles5', 'Circles6', 'Circles7'] },
      { type: 'chow', tiles: ['Characters7', 'Characters8', 'Characters9'] },
      { type: 'pair', tiles: ['Bamboo9', 'Bamboo9'] },
    ],
    type: 'boolean',
  },
  {
    id: 'allPungOnePair',
    name: 'All Pung, One Pair',
    category: 'medium',
    points: 3,
    pointsLabel: '+3',
    description:
      'Your hand has four triplets or kongs and one pair, with no sequences.',
    beginnerCheckInstructions:
      'Every set in your hand is three (or four) of the same tile, plus one pair.',
    tileExamples: ['Circles5', 'Circles5', 'Circles5'],
    exampleHand: [
      { type: 'pung', tiles: ['Bamboo3', 'Bamboo3', 'Bamboo3'] },
      { type: 'pung', tiles: ['Circles5', 'Circles5', 'Circles5'] },
      { type: 'pung', tiles: ['Characters7', 'Characters7', 'Characters7'] },
      { type: 'pung', tiles: ['EastWind', 'EastWind', 'EastWind'] },
      { type: 'pair', tiles: ['RedDragon', 'RedDragon'] },
    ],
    type: 'boolean',
  },
  {
    id: 'sevenPairs',
    name: 'Seven Pairs',
    category: 'medium',
    points: 4,
    pointsLabel: '+4',
    description:
      'Your hand is made of seven different pairs instead of the normal four sets and a pair.',
    beginnerCheckInstructions:
      'Count the pairs in your 14 tiles. Exactly seven pairs = Yes.',
    tileExamples: ['Bamboo2', 'Bamboo2', 'Circles4', 'Circles4', 'Characters7', 'Characters7'],
    exampleHand: [
      { type: 'pair', tiles: ['Bamboo2', 'Bamboo2'] },
      { type: 'pair', tiles: ['Bamboo5', 'Bamboo5'] },
      { type: 'pair', tiles: ['Circles3', 'Circles3'] },
      { type: 'pair', tiles: ['Circles8', 'Circles8'] },
      { type: 'pair', tiles: ['Characters1', 'Characters1'] },
      { type: 'pair', tiles: ['Characters9', 'Characters9'] },
      { type: 'pair', tiles: ['EastWind', 'EastWind'] },
    ],
    type: 'boolean',
  },
  {
    id: 'mixMatchSuit',
    name: 'Mix + Match Suit',
    category: 'medium',
    points: 3,
    pointsLabel: '+3',
    description:
      'Your hand uses one numbered suit plus honor tiles (winds and dragons). Also called half flush.',
    beginnerCheckInstructions:
      'Pick one suit (Bamboo, Circles, or Characters). Every numbered tile must be from that suit. The rest are winds or dragons only.',
    tileExamples: ['Bamboo3', 'Bamboo7', 'EastWind', 'RedDragon'],
    exampleHand: [
      { type: 'chow', tiles: ['Bamboo1', 'Bamboo2', 'Bamboo3'] },
      { type: 'chow', tiles: ['Bamboo4', 'Bamboo5', 'Bamboo6'] },
      { type: 'pung', tiles: ['Bamboo8', 'Bamboo8', 'Bamboo8'] },
      { type: 'pung', tiles: ['EastWind', 'EastWind', 'EastWind'] },
      { type: 'pair', tiles: ['RedDragon', 'RedDragon'] },
    ],
    type: 'boolean',
  },
  {
    id: 'allOneSuit',
    name: 'All One Suit',
    category: 'medium',
    points: 7,
    pointsLabel: '+7',
    description:
      'Every tile in your hand is from one numbered suit only, with no winds or dragons.',
    beginnerCheckInstructions:
      'Every tile must be the same suit. No honors allowed at all.',
    tileExamples: ['Circles1', 'Circles3', 'Circles5', 'Circles7', 'Circles9'],
    exampleHand: [
      { type: 'chow', tiles: ['Circles1', 'Circles2', 'Circles3'] },
      { type: 'chow', tiles: ['Circles4', 'Circles5', 'Circles6'] },
      { type: 'chow', tiles: ['Circles7', 'Circles8', 'Circles9'] },
      { type: 'pung', tiles: ['Circles5', 'Circles5', 'Circles5'] },
      { type: 'pair', tiles: ['Circles2', 'Circles2'] },
    ],
    type: 'boolean',
  },

  {
    id: 'smallDragons',
    name: 'Small Dragons',
    category: 'big',
    points: 6,
    pointsLabel: '6',
    description:
      'You have triplets or kongs of two dragons, plus a pair of the third dragon.',
    beginnerCheckInstructions:
      'Two dragons appear as triplets (or kongs), the third dragon appears as a pair.',
    tileExamples: ['RedDragon', 'GreenDragon', 'WhiteDragon'],
    exampleHand: [
      { type: 'pung', tiles: ['RedDragon', 'RedDragon', 'RedDragon'] },
      { type: 'pung', tiles: ['GreenDragon', 'GreenDragon', 'GreenDragon'] },
      { type: 'pair', tiles: ['WhiteDragon', 'WhiteDragon'] },
      { type: 'chow', tiles: ['Bamboo3', 'Bamboo4', 'Bamboo5'] },
      { type: 'pung', tiles: ['Circles7', 'Circles7', 'Circles7'] },
    ],
    type: 'boolean',
  },
  {
    id: 'bigDragons',
    name: 'Big Dragons',
    category: 'big',
    points: 8,
    pointsLabel: '8',
    description:
      'You have triplets or kongs of all three dragons: Red, Green, and White.',
    beginnerCheckInstructions: 'All three dragons appear as triplets or kongs.',
    tileExamples: ['RedDragon', 'GreenDragon', 'WhiteDragon'],
    exampleHand: [
      { type: 'pung', tiles: ['RedDragon', 'RedDragon', 'RedDragon'] },
      { type: 'pung', tiles: ['GreenDragon', 'GreenDragon', 'GreenDragon'] },
      { type: 'pung', tiles: ['WhiteDragon', 'WhiteDragon', 'WhiteDragon'] },
      { type: 'chow', tiles: ['Bamboo3', 'Bamboo4', 'Bamboo5'] },
      { type: 'pair', tiles: ['EastWind', 'EastWind'] },
    ],
    type: 'boolean',
  },
  {
    id: 'smallWinds',
    name: 'Small Winds',
    category: 'big',
    points: 6,
    pointsLabel: '6',
    description:
      'You have triplets or kongs of three winds, plus a pair of the fourth wind.',
    beginnerCheckInstructions:
      'Three winds appear as triplets (or kongs), the fourth wind appears as a pair.',
    tileExamples: ['EastWind', 'SouthWind', 'WestWind', 'NorthWind'],
    exampleHand: [
      { type: 'pung', tiles: ['EastWind', 'EastWind', 'EastWind'] },
      { type: 'pung', tiles: ['SouthWind', 'SouthWind', 'SouthWind'] },
      { type: 'pung', tiles: ['WestWind', 'WestWind', 'WestWind'] },
      { type: 'pair', tiles: ['NorthWind', 'NorthWind'] },
      { type: 'pung', tiles: ['Circles5', 'Circles5', 'Circles5'] },
    ],
    type: 'boolean',
  },
  {
    id: 'bigWinds',
    name: 'Big Winds',
    category: 'big',
    points: 13,
    pointsLabel: '13',
    description: 'You have triplets or kongs of all four winds.',
    beginnerCheckInstructions: 'All four winds appear as triplets or kongs.',
    tileExamples: ['EastWind', 'SouthWind', 'WestWind', 'NorthWind'],
    exampleHand: [
      { type: 'pung', tiles: ['EastWind', 'EastWind', 'EastWind'] },
      { type: 'pung', tiles: ['SouthWind', 'SouthWind', 'SouthWind'] },
      { type: 'pung', tiles: ['WestWind', 'WestWind', 'WestWind'] },
      { type: 'pung', tiles: ['NorthWind', 'NorthWind', 'NorthWind'] },
      { type: 'pair', tiles: ['RedDragon', 'RedDragon'] },
    ],
    type: 'boolean',
  },
  {
    id: 'allHonor',
    name: 'All Honor Tiles',
    category: 'big',
    points: 10,
    pointsLabel: '10',
    description:
      'Every tile in your winning hand is a wind or dragon tile. There are no numbered suit tiles.',
    beginnerCheckInstructions:
      'No Bamboo, Circles, or Characters tiles at all — only winds and dragons.',
    tileExamples: ['EastWind', 'SouthWind', 'RedDragon', 'GreenDragon', 'WhiteDragon'],
    exampleHand: [
      { type: 'pung', tiles: ['EastWind', 'EastWind', 'EastWind'] },
      { type: 'pung', tiles: ['SouthWind', 'SouthWind', 'SouthWind'] },
      { type: 'pung', tiles: ['RedDragon', 'RedDragon', 'RedDragon'] },
      { type: 'pung', tiles: ['GreenDragon', 'GreenDragon', 'GreenDragon'] },
      { type: 'pair', tiles: ['WhiteDragon', 'WhiteDragon'] },
    ],
    type: 'boolean',
  },
  {
    id: 'thirteenOrphans',
    name: 'Thirteen Orphans',
    category: 'big',
    points: 13,
    pointsLabel: '13',
    description:
      'A special hand with one of every terminal and honor tile, plus one duplicate to form a pair.',
    beginnerCheckInstructions:
      'You need 1 and 9 of every suit, all four winds, and all three dragons, with one of them doubled to make 14 tiles.',
    tileExamples: [
      'Bamboo1',
      'Bamboo9',
      'Circles1',
      'Circles9',
      'Characters1',
      'Characters9',
      'EastWind',
      'SouthWind',
      'WestWind',
      'NorthWind',
      'RedDragon',
      'GreenDragon',
      'WhiteDragon',
    ],
    exampleHand: [
      {
        type: 'terminals',
        tiles: [
          'Bamboo1',
          'Bamboo9',
          'Circles1',
          'Circles9',
          'Characters1',
          'Characters9',
        ],
      },
      {
        type: 'honors',
        tiles: [
          'EastWind',
          'SouthWind',
          'WestWind',
          'NorthWind',
          'RedDragon',
          'GreenDragon',
          'WhiteDragon',
        ],
      },
      { type: 'pair', tiles: ['WhiteDragon', 'WhiteDragon'] },
    ],
    type: 'boolean',
  },
];

export function getRule(id) {
  return SCORING_RULES.find((rule) => rule.id === id) || null;
}

export function getTotalPoints(selections) {
  let total = 0;
  for (const rule of SCORING_RULES) {
    const value = selections[rule.id];
    if (rule.type === 'multiSelect') {
      if (Array.isArray(value)) {
        for (const optionId of value) {
          const option = rule.options.find((o) => o.id === optionId);
          if (option) total += option.points;
        }
      }
    } else if (rule.type === 'boolean') {
      if (value) total += rule.points;
    }
  }
  return total;
}

export function getCountedBreakdown(selections) {
  const items = [];
  for (const rule of SCORING_RULES) {
    const value = selections[rule.id];
    if (rule.type === 'multiSelect' && Array.isArray(value) && value.length > 0) {
      for (const optionId of value) {
        const option = rule.options.find((o) => o.id === optionId);
        if (option) {
          items.push({
            ruleId: rule.id,
            label: option.label,
            points: option.points,
            tile: option.tile,
          });
        }
      }
    } else if (rule.type === 'boolean' && value) {
      items.push({
        ruleId: rule.id,
        label: rule.name,
        points: rule.points,
      });
    }
  }
  return items;
}
