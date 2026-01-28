import type { Pokemon } from '../../api/pokemonApi/pokemonsApi';
import { getPokemonInfo } from '../../scripts/pokemonInfo';
import './PokemonInfo.css';

const PokemonInfo = ({ pokemon }: { pokemon: Pokemon }) => {
    const { sprite, types, attackStat, rarity, cardGradient, weaknesses } = getPokemonInfo(pokemon);

    return (
        <div className='pokemon-info'>
            <div className='pokemon-info__pokemon-image' style={{ background: cardGradient }}>
                <img src={sprite} alt={pokemon.name} />
            </div>
            <div className='pokemon-info__pokemon-description'>
                <div className='pokemon-description__header'>
                    <h2 className='pokemon-description__name'>{pokemon.name}</h2>
                    <div className='pokemon-description__rarity' style={{ background: cardGradient }}>{rarity}</div>
                    <div className='pokemon-description__attack' style={{ background: cardGradient }}>Сила {attackStat}</div>
                </div>
                <div className='pokemon-description__typeAndWeaknesses'>
                    <div className='pokemon-description__type-block'>
                        <div className='pokemon-description__type-label'>Тип покемона</div>
                        <div className='pokemon-description__type-value'>{types}</div>
                    </div>
                    <div className='pokemon-description__weaknesses-block'>
                        <div className='pokemon-description__weaknesses-label'>Слабости покемона</div>
                        <div className='pokemon-description__weaknesses-value'>{weaknesses}</div>
                    </div>
                </div>
                <div className='pokemon-description__parameters'>
                    <div className='pokemon-description__parameter-row pokemon-description__parameter-row--shadowed'>
                        <span className='pokemon-description__parameter-name'>Рост</span>
                        <span className='pokemon-description__parameter-value'>{pokemon.height / 10} м</span>
                    </div>
                    <div className='pokemon-description__parameter-row'>
                        <span className='pokemon-description__parameter-name'>Вес</span>
                        <span className='pokemon-description__parameter-value'>{pokemon.weight / 10} кг</span>
                    </div>
                    <div className='pokemon-description__parameter-row pokemon-description__parameter-row--shadowed'>
                        <span className='pokemon-description__parameter-name'>Скорость</span>
                        <span className='pokemon-description__parameter-value'>{pokemon.stats.find((stat) => stat.stat.name === 'speed')?.base_stat || 0}</span>
                    </div>
                    <div className='pokemon-description__parameter-row'>
                        <span className='pokemon-description__parameter-name'>Опыт</span>
                        <span className='pokemon-description__parameter-value'>{pokemon.base_experience}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PokemonInfo;