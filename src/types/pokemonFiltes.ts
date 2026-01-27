export interface PokemonFilters {
    power: string;
    rarity: string;
    element: string;
}

export const POWER_FILTERS = {
    label: 'По силе',
    options: [
        { value: 'all', label: 'Все' },
        { value: 'weak', label: 'Слабые' },
        { value: 'average', label: 'Средние' },
        { value: 'strong', label: 'Сильные' },
    ]
}

export const RARITY_FILTERS = {
    label: 'По редкости',
    options: [
        { value: 'all', label: 'Все' },
        { value: 'common', label: 'Обычные' },
        { value: 'legendary', label: 'Легендарные' },
        { value: 'mythical', label: 'Мифические' },
    ]
}

export const ELEMENT_FILTERS = {
    label: 'По стихии',
}

// Определение редкости по is_legendary и is_mythical
export function getRarityFromSpecies(
    isLegendary: boolean, 
    isMythical: boolean
): string {
    if (isMythical) {
        return 'mythical';
    }
    
    if (isLegendary) {
        return 'legendary';
    }
    
    return 'common';
}

// Определение силы по attack stat
export function getPowerLevel(attackStat: number): string {
    if (attackStat < 40) return 'weak';
    if (attackStat >= 40 && attackStat <= 60) return 'average';
    return 'strong';
}
