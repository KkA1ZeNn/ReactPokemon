import type { Pokemon } from "../api/pokemonApi/pokemonsApi"
import { RARITY_GRADIENTS, RARITY_TRANSLATIONS, TYPE_GRADIENTS, TYPE_TRANSLATIONS } from "../constants/pokemonConstants";

export const getPokemonInfo = (pokemon: Pokemon) => {
    const sprite = pokemon.sprites?.other?.['official-artwork']?.front_default ||
        pokemon.sprites?.front_default ||
        'https://via.placeholder.com/150';

    const attackStat = pokemon.stats.find((stat) => stat.stat.name === 'attack')?.base_stat || 0;

    const types = pokemon.types
        .map(t => TYPE_TRANSLATIONS[t.type.name] || t.type.name)
        .join(' + ');

    const rarity = pokemon.rarity ? RARITY_TRANSLATIONS[pokemon.rarity] || pokemon.rarity : 'Обычный';

    // НАДО ЗАМЕНИТЬ НА РЕАЛЬНЫЕ СЛАБОСТИ
    const weaknesses = pokemon.types
        .map(w => TYPE_TRANSLATIONS[w.type.name] || w.type.name)
        .join(' + ');

    // Определяем градиент для карточки
    let cardGradient: string;

    if (pokemon.rarity === 'mythical') {
       cardGradient = RARITY_GRADIENTS.mythical;
    } else if (pokemon.rarity === 'legendary') {
       cardGradient = RARITY_GRADIENTS.legendary;
    } else {
       const primaryType = pokemon.types[0]?.type.name || 'normal';
       cardGradient = TYPE_GRADIENTS[primaryType] || TYPE_GRADIENTS.normal;
    }

    return {
        sprite,
        types,
        attackStat,
        rarity,
        cardGradient,
        weaknesses,
    }
}