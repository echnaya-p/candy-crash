export type CandyColor = 'red' | 'yellow' | 'green' | 'blue' | 'purple';

export type CellValue = CandyColor | 'white';

export type BoardState = CellValue[];

export type IconPackKey = 'berries' | 'animals' | 'places' | 'activities' | 'smileys';

export interface IconPack {
  label: string;
  emojis: Record<CandyColor, string>;
}

export interface CandyDisplayConfig {
  emoji: string;
  bg: string;
}

export type LangKey = 'en' | 'ru' | 'zh';

export type TranslationKey =
  | 'title' | 'chooseMode' | 'lite' | 'liteDesc'
  | 'timed' | 'timedDesc' | 'score' | 'timesUp'
  | 'playAgain' | 'menu';

export interface LanguageConfig {
  label: string;
  flag: string;
}

export type GameMode = 'lite' | 'timed';

export interface BoardProps {
  isMuted: boolean;
  iconPack: IconPackKey;
  gameMode: GameMode;
  lang: LangKey;
  onExit: () => void;
}
