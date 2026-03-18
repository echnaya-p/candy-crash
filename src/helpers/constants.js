export const SIZE_BOARD = 8;
export const COLORS = ['red', 'yellow', 'green', 'blue', 'purple'];

export const ICON_PACKS = {
    berries: {
        label: '🍓',
        emojis: { red: '🍓', yellow: '🍋', green: '🍏', blue: '🫐', purple: '🍇' },
    },
    animals: {
        label: '🐱',
        emojis: { red: '🐱', yellow: '🐶', green: '🐸', blue: '🐬', purple: '🦄' },
    },
    places: {
        label: '🏔️',
        emojis: { red: '🌋', yellow: '🏖️', green: '🏔️', blue: '🏝️', purple: '🏰' },
    },
    activities: {
        label: '⚽',
        emojis: { red: '🎸', yellow: '⚽', green: '🎮', blue: '🏄', purple: '🎨' },
    },
    smileys: {
        label: '😊',
        emojis: { red: '😍', yellow: '😂', green: '🤩', blue: '😎', purple: '🥳' },
    },
};

export const CANDY_BG = {
    red:    'linear-gradient(135deg, rgba(255, 107, 107, 0.4), rgba(238, 90, 36, 0.3))',
    yellow: 'linear-gradient(135deg, rgba(255, 211, 42, 0.4), rgba(246, 185, 59, 0.3))',
    green:  'linear-gradient(135deg, rgba(123, 237, 159, 0.4), rgba(46, 213, 115, 0.3))',
    blue:   'linear-gradient(135deg, rgba(112, 161, 255, 0.4), rgba(30, 144, 255, 0.3))',
    purple: 'linear-gradient(135deg, rgba(162, 155, 254, 0.4), rgba(108, 92, 231, 0.3))',
    white:  'transparent',
};

export function getCandyConfig(iconPack) {
    const pack = ICON_PACKS[iconPack] || ICON_PACKS.berries;
    const config = {};
    for (const color of COLORS) {
        config[color] = { emoji: pack.emojis[color], bg: CANDY_BG[color] };
    }
    config.white = { emoji: '', bg: 'transparent' };
    return config;
}
