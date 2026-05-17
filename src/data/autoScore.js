// Decompose a 14+ tile hand into sets (chow/pung/kong/pair), detect
// special hands (Thirteen Orphans, Seven Pairs), and derive the same
// "selections" object used by the manual counter so the existing
// scoring engine (getTotalPoints / getCountedBreakdown) keeps working.

import { SCORING_RULES, getTotalPoints } from './scoringRules.js';

const WINDS = ['EastWind', 'SouthWind', 'WestWind', 'NorthWind'];
const DRAGONS = ['RedDragon', 'GreenDragon', 'WhiteDragon'];
const SUITS = ['Bamboo', 'Circles', 'Characters'];

const ORPHAN_TILES = [
  'Bamboo1',
  'Bamboo9',
  'Circles1',
  'Circles9',
  'Characters1',
  'Characters9',
  ...WINDS,
  ...DRAGONS,
];

const SEAT_FLOWER_NUMBER = {
  EastWind: 1,
  SouthWind: 2,
  WestWind: 3,
  NorthWind: 4,
};

const DRAGON_OPTION_ID = {
  RedDragon: 'red',
  GreenDragon: 'green',
  WhiteDragon: 'white',
};

export const TILE_ORDER = [
  ...SUITS.flatMap((s) => Array.from({ length: 9 }, (_, i) => `${s}${i + 1}`)),
  ...WINDS,
  ...DRAGONS,
  ...['Flowers', 'Seasons'].flatMap((s) =>
    Array.from({ length: 4 }, (_, i) => `${s}${i + 1}`),
  ),
];

const TILE_INDEX = Object.fromEntries(TILE_ORDER.map((t, i) => [t, i]));

export function sortTiles(tiles) {
  return [...tiles].sort(
    (a, b) => (TILE_INDEX[a] ?? 999) - (TILE_INDEX[b] ?? 999),
  );
}

export function buildEmptySelections() {
  const empty = {};
  for (const rule of SCORING_RULES) {
    empty[rule.id] = rule.type === 'multiSelect' ? [] : false;
  }
  return empty;
}

function isWind(t) {
  return WINDS.includes(t);
}

function isDragon(t) {
  return DRAGONS.includes(t);
}

function isHonor(t) {
  return isWind(t) || isDragon(t);
}

function isBonus(t) {
  return typeof t === 'string' && (t.startsWith('Flowers') || t.startsWith('Seasons'));
}

function suitOf(t) {
  if (!t) return null;
  if (t.startsWith('Bamboo')) return 'Bamboo';
  if (t.startsWith('Circles')) return 'Circles';
  if (t.startsWith('Characters')) return 'Characters';
  return null;
}

function bonusNumber(t) {
  if (!t) return null;
  const m = t.match(/^(?:Flowers|Seasons)(\d)$/);
  return m ? Number(m[1]) : null;
}

function countsToString(counts) {
  return TILE_ORDER.map((t) => counts[t] || 0).join(',');
}

function countTiles(tiles) {
  const counts = {};
  for (const t of tiles) counts[t] = (counts[t] || 0) + 1;
  return counts;
}

// Decompose remaining tiles into 4 sets (chow/pung/kong) + 1 pair.
// Returns an array of decompositions, each an array of { type, tiles }.
const MAX_DECOMPOSITIONS = 64;

function decomposeStandard(counts) {
  const memo = new Map();
  const results = [];

  function recurse(currentCounts, pairUsed, acc) {
    if (results.length >= MAX_DECOMPOSITIONS) return;

    const memoKey = countsToString(currentCounts) + '|' + (pairUsed ? '1' : '0');
    if (memo.has(memoKey)) return;
    memo.set(memoKey, true);

    let firstTile = null;
    for (const t of TILE_ORDER) {
      if ((currentCounts[t] || 0) > 0) {
        firstTile = t;
        break;
      }
    }

    if (firstTile === null) {
      if (pairUsed && acc.filter((s) => s.type !== 'pair').length === 4) {
        results.push([...acc]);
      }
      return;
    }

    const count = currentCounts[firstTile];

    // Try as pair
    if (!pairUsed && count >= 2) {
      const next = { ...currentCounts, [firstTile]: count - 2 };
      recurse(next, true, [...acc, { type: 'pair', tiles: [firstTile, firstTile] }]);
    }

    // Try as kong (must use all 4 since we'd never split them)
    if (count >= 4) {
      const next = { ...currentCounts, [firstTile]: count - 4 };
      recurse(next, pairUsed, [
        ...acc,
        { type: 'kong', tiles: [firstTile, firstTile, firstTile, firstTile] },
      ]);
    }

    // Try as pung
    if (count >= 3) {
      const next = { ...currentCounts, [firstTile]: count - 3 };
      recurse(next, pairUsed, [
        ...acc,
        { type: 'pung', tiles: [firstTile, firstTile, firstTile] },
      ]);
    }

    // Try as chow (suited 1..7)
    const suit = suitOf(firstTile);
    if (suit) {
      const num = Number(firstTile.slice(suit.length));
      if (num >= 1 && num <= 7) {
        const t2 = `${suit}${num + 1}`;
        const t3 = `${suit}${num + 2}`;
        if ((currentCounts[t2] || 0) >= 1 && (currentCounts[t3] || 0) >= 1) {
          const next = {
            ...currentCounts,
            [firstTile]: count - 1,
            [t2]: currentCounts[t2] - 1,
            [t3]: currentCounts[t3] - 1,
          };
          recurse(next, pairUsed, [
            ...acc,
            { type: 'chow', tiles: [firstTile, t2, t3] },
          ]);
        }
      }
    }
  }

  recurse(counts, false, []);
  return results;
}

function isThirteenOrphans(counts) {
  const tiles = Object.entries(counts).filter(([, c]) => c > 0);
  if (tiles.length !== 13) return false;
  if (!tiles.every(([k]) => ORPHAN_TILES.includes(k))) return false;
  const total = tiles.reduce((sum, [, c]) => sum + c, 0);
  if (total !== 14) return false;
  const doubles = tiles.filter(([, c]) => c === 2).length;
  const singles = tiles.filter(([, c]) => c === 1).length;
  return doubles === 1 && singles === 12;
}

function isSevenPairs(counts) {
  const tiles = Object.entries(counts).filter(([, c]) => c > 0);
  if (tiles.length !== 7) return false;
  return tiles.every(([, c]) => c === 2);
}

// Build the same "selections" shape the manual counter uses, given
// a structured decomposition.
function buildSelectionsFromSets({
  tiles,
  flowers,
  sets,
  isThirteen,
  isSeven,
  seatWind,
  roundWind,
  selfDraw,
}) {
  const selections = buildEmptySelections();

  // Flowers
  selections.noFlowers = (flowers || []).length === 0;
  const seatNum = SEAT_FLOWER_NUMBER[seatWind] || null;
  if (seatNum !== null) {
    selections.yourFlowers = (flowers || []).some(
      (f) => bonusNumber(f) === seatNum,
    );
  }

  const pungOf = new Set();
  const pairOf = new Set();
  let chowCount = 0;
  let pungCount = 0;
  for (const set of sets || []) {
    const lead = set?.tiles?.[0];
    if (!lead) continue;
    if (set.type === 'pung' || set.type === 'kong') {
      pungOf.add(lead);
      pungCount += 1;
    } else if (set.type === 'chow') {
      chowCount += 1;
    } else if (set.type === 'pair') {
      pairOf.add(lead);
    }
  }

  if (seatWind && pungOf.has(seatWind)) selections.yourWindPung = true;
  if (roundWind && pungOf.has(roundWind)) selections.roundWindPung = true;

  const dragonPungs = DRAGONS.filter((d) => pungOf.has(d));
  selections.dragonPungs = dragonPungs.map((d) => DRAGON_OPTION_ID[d]);

  selections.selfDraw = !!selfDraw;

  if (isThirteen) selections.thirteenOrphans = true;
  if (isSeven) selections.sevenPairs = true;

  const totalNonPair = chowCount + pungCount;
  if (!isThirteen && !isSeven && totalNonPair === 4 && pairOf.size >= 1) {
    if (pungCount === 0) selections.allEatingOnePair = true;
    if (chowCount === 0) selections.allPungOnePair = true;
  }

  // Suit-based rules use every tile in the hand
  const handTiles = Array.isArray(tiles) ? tiles : [];
  const suitsUsed = new Set();
  let hasHonors = false;
  for (const t of handTiles) {
    const s = suitOf(t);
    if (s) suitsUsed.add(s);
    if (isHonor(t)) hasHonors = true;
  }
  if (!isThirteen) {
    if (suitsUsed.size === 1 && !hasHonors) selections.allOneSuit = true;
    if (suitsUsed.size === 1 && hasHonors) selections.mixMatchSuit = true;
    if (suitsUsed.size === 0 && hasHonors) selections.allHonor = true;
  }

  // Dragon combos
  const dragonPair = DRAGONS.filter((d) => pairOf.has(d));
  if (dragonPungs.length === 3) {
    selections.bigDragons = true;
  } else if (dragonPungs.length === 2 && dragonPair.length === 1) {
    selections.smallDragons = true;
  }

  // Wind combos
  const windPungs = WINDS.filter((w) => pungOf.has(w));
  const windPair = WINDS.filter((w) => pairOf.has(w));
  if (windPungs.length === 4) {
    selections.bigWinds = true;
  } else if (windPungs.length === 3 && windPair.length === 1) {
    selections.smallWinds = true;
  }

  // Chicken hand: only if nothing else counted
  const hasAnyScoring =
    selections.noFlowers ||
    selections.yourFlowers ||
    selections.yourWindPung ||
    selections.roundWindPung ||
    selections.dragonPungs.length > 0 ||
    selections.selfDraw ||
    selections.allEatingOnePair ||
    selections.allPungOnePair ||
    selections.sevenPairs ||
    selections.mixMatchSuit ||
    selections.allOneSuit ||
    selections.smallDragons ||
    selections.bigDragons ||
    selections.smallWinds ||
    selections.bigWinds ||
    selections.allHonor ||
    selections.thirteenOrphans;
  if (!hasAnyScoring) selections.chickenHand = true;

  return selections;
}

// Main entry. Inputs:
//   tiles:      array of hand tile keys (concealed + melded = 14..18 tiles)
//   flowers:    array of bonus tile keys (Flowers/Seasons), kept aside
//   seatWind, roundWind, selfDraw
// Output:
//   { status, selections, sets, isThirteen, isSevenPairs, points }
//   status: 'empty' | 'too_few' | 'too_many' | 'invalid' | 'ok'
export function computeAutoScore({
  tiles,
  flowers,
  seatWind,
  roundWind,
  selfDraw,
}) {
  const handTiles = (tiles || []).filter((t) => !isBonus(t));
  const bonusTiles = (flowers || []).filter(isBonus);
  const total = handTiles.length;

  if (total === 0) {
    return {
      status: 'empty',
      selections: null,
      sets: null,
      isThirteen: false,
      isSevenPairs: false,
      points: 0,
    };
  }
  if (total < 14) {
    return {
      status: 'too_few',
      missing: 14 - total,
      selections: null,
      sets: null,
      isThirteen: false,
      isSevenPairs: false,
      points: 0,
    };
  }
  if (total > 18) {
    return {
      status: 'too_many',
      extra: total - 18,
      selections: null,
      sets: null,
      isThirteen: false,
      isSevenPairs: false,
      points: 0,
    };
  }

  const counts = countTiles(handTiles);

  // Special hands first
  if (isThirteenOrphans(counts)) {
    const orphanSets = [];
    for (const t of ORPHAN_TILES) {
      if ((counts[t] || 0) >= 2) {
        orphanSets.push({ type: 'pair', tiles: [t, t] });
      } else if ((counts[t] || 0) === 1) {
        orphanSets.push({ type: 'pair', tiles: [t] });
      }
    }
    const selections = buildSelectionsFromSets({
      tiles: handTiles,
      flowers: bonusTiles,
      sets: orphanSets,
      isThirteen: true,
      isSeven: false,
      seatWind,
      roundWind,
      selfDraw,
    });
    return {
      status: 'ok',
      selections,
      sets: orphanSets,
      isThirteen: true,
      isSevenPairs: false,
      points: getTotalPoints(selections),
    };
  }

  if (isSevenPairs(counts)) {
    const pairSets = Object.entries(counts)
      .filter(([, c]) => c > 0)
      .map(([t]) => ({ type: 'pair', tiles: [t, t] }));
    const selections = buildSelectionsFromSets({
      tiles: handTiles,
      flowers: bonusTiles,
      sets: pairSets,
      isThirteen: false,
      isSeven: true,
      seatWind,
      roundWind,
      selfDraw,
    });
    return {
      status: 'ok',
      selections,
      sets: pairSets,
      isThirteen: false,
      isSevenPairs: true,
      points: getTotalPoints(selections),
    };
  }

  // Standard decomposition
  const decompositions = decomposeStandard(counts);
  if (decompositions.length === 0) {
    return {
      status: 'invalid',
      selections: null,
      sets: null,
      isThirteen: false,
      isSevenPairs: false,
      points: 0,
    };
  }

  let best = null;
  for (const sets of decompositions) {
    const selections = buildSelectionsFromSets({
      tiles: handTiles,
      flowers: bonusTiles,
      sets,
      isThirteen: false,
      isSeven: false,
      seatWind,
      roundWind,
      selfDraw,
    });
    const points = getTotalPoints(selections);
    if (!best || points > best.points) {
      best = { points, selections, sets };
    }
  }

  return {
    status: 'ok',
    selections: best.selections,
    sets: best.sets,
    isThirteen: false,
    isSevenPairs: false,
    points: best.points,
  };
}
