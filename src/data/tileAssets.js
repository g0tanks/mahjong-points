// Map of tile key -> { src, alt }.
// Files live in public/Tiles/ and are emitted to dist/Tiles/<filename>.
// Paths are relative ("./Tiles/...") so the app works when hosted at the
// site root OR inside a sub-directory on a static (e.g. PHP) host. If a key
// is missing the TileImage component renders a styled placeholder.

const TILE_BASE = './Tiles';

function suit(prefix, label) {
  const entries = {};
  for (let i = 1; i <= 9; i += 1) {
    entries[`${prefix}${i}`] = {
      src: `${TILE_BASE}/${prefix}${i}.png`,
      alt: `${i} ${label}`,
      shortLabel: `${i}`,
      group: label,
    };
  }
  return entries;
}

function bonus(prefix, label) {
  const entries = {};
  for (let i = 1; i <= 4; i += 1) {
    entries[`${prefix}${i}`] = {
      src: `${TILE_BASE}/${prefix}${i}.png`,
      alt: `${label} ${i}`,
      shortLabel: `${i}`,
      group: label,
    };
  }
  return entries;
}

export const TILES = {
  ...suit('Bamboo', 'Bamboo'),
  ...suit('Circles', 'Circles'),
  ...suit('Characters', 'Characters'),

  EastWind: { src: `${TILE_BASE}/EastWind.png`, alt: 'East Wind', shortLabel: 'E', group: 'Winds' },
  SouthWind: { src: `${TILE_BASE}/SouthWind.png`, alt: 'South Wind', shortLabel: 'S', group: 'Winds' },
  WestWind: { src: `${TILE_BASE}/WestWind.png`, alt: 'West Wind', shortLabel: 'W', group: 'Winds' },
  NorthWind: { src: `${TILE_BASE}/NorthWind.png`, alt: 'North Wind', shortLabel: 'N', group: 'Winds' },

  RedDragon: { src: `${TILE_BASE}/RedDragon.png`, alt: 'Red Dragon', shortLabel: '中', group: 'Dragons' },
  GreenDragon: { src: `${TILE_BASE}/GreenDragon.png`, alt: 'Green Dragon', shortLabel: '發', group: 'Dragons' },
  WhiteDragon: { src: `${TILE_BASE}/WhiteDragon.png`, alt: 'White Dragon', shortLabel: '白', group: 'Dragons' },

  ...bonus('Flowers', 'Flower'),
  ...bonus('Seasons', 'Season'),
};

export function getTile(key) {
  return TILES[key] || null;
}
