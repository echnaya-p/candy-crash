import { LangKey, TranslationKey, LanguageConfig } from '../types';

export const LANGUAGES: Record<LangKey, LanguageConfig> = {
    en: { label: 'EN', flag: '🇬🇧' },
    ru: { label: 'RU', flag: '🇷🇺' },
    zh: { label: 'ZH', flag: '🇨🇳' },
};

const translations: Record<LangKey, Record<TranslationKey, string>> = {
    en: {
        title: 'Candy Crash',
        chooseMode: 'Choose game mode',
        lite: 'Lite',
        liteDesc: 'Play at your own pace',
        timed: 'Timed',
        timedDesc: '30 seconds challenge',
        score: 'Score',
        timesUp: "Time's up!",
        playAgain: 'Play Again',
        menu: 'Menu',
    },
    ru: {
        title: 'Candy Crash',
        chooseMode: 'Выберите режим игры',
        lite: 'Лайт',
        liteDesc: 'Играйте в своём темпе',
        timed: 'На время',
        timedDesc: '30 секунд на рекорд',
        score: 'Счёт',
        timesUp: 'Время вышло!',
        playAgain: 'Ещё раз',
        menu: 'Меню',
    },
    zh: {
        title: 'Candy Crash',
        chooseMode: '选择游戏模式',
        lite: '休闲',
        liteDesc: '按自己的节奏玩',
        timed: '限时',
        timedDesc: '30秒挑战',
        score: '分数',
        timesUp: '时间到！',
        playAgain: '再来一局',
        menu: '菜单',
    },
};

export function t(lang: LangKey, key: TranslationKey): string {
    return translations[lang]?.[key] || translations.en[key] || key;
}
