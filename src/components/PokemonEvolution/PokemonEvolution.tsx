import { useEffect, useState } from 'react';
import { POKEMON_API, type EvolutionChainElement, type Pokemon } from '../../api/pokemonApi/pokemonsApi';
import { useNavigate } from 'react-router-dom';
import { TYPE_GRADIENTS } from '../../constants/pokemonConstants';
import './PokemonEvolution.css';

const PokemonEvolution = ({ evolutionChain, currentPokemonId }: { evolutionChain: EvolutionChainElement[], currentPokemonId: number }) => {

    const [pokemonsForEvolution, setPokemonsForEvolution] = useState<Pokemon[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        try {
            const getData = async () => {
                const data = await Promise.all(evolutionChain.map(async (element) => {
                    const response = await POKEMON_API.getPokemon(element.name);
                    return response;
                }));

                setPokemonsForEvolution(data);
            }
            getData();
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }, [evolutionChain]);

    return (
        <div className='pokemon-evolution'>
            <h2 className='pokemon-evolution__header'>
                Эволюция
            </h2>
            <div className='pokemon-evolution__list'>
                {pokemonsForEvolution.map((pokemon, index) => {
                    const isCurrentPokemon = pokemon.id === currentPokemonId;
                    const primaryType = pokemon.types[0]?.type.name || 'normal';
                    const gradient = TYPE_GRADIENTS[primaryType] || TYPE_GRADIENTS.normal;

                    return (
                        <div
                            className='pokemon-evolution__item'
                            key={pokemon.id}
                        >
                            <div
                                onClick={() => navigate(`/pokemon/${pokemon.id}`)}
                                className={`pokemon-evolution__image-wrapper ${index < pokemonsForEvolution.length - 1 ? 'pokemon-evolution__image-wrapper--with-arrow' : ''} ${isCurrentPokemon ? 'pokemon-evolution__image-wrapper--current' : ''}`}
                                style={isCurrentPokemon ? { background: gradient } : {}}
                            >
                                <img src={pokemon.sprites.other?.['official-artwork']?.front_default || 'https://via.placeholder.com/150'} alt={pokemon.name} />
                            </div>
                            <div className='pokemon-evolution__item-name'>
                                {pokemon.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default PokemonEvolution;