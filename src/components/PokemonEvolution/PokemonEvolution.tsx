import type { EvolutionChain } from '../../api/pokemonApi/pokemonsApi';
import './PokemonEvolution.css';

const PokemonEvolution = ({ evolutionChain }: { evolutionChain: EvolutionChain }) => {
    return (
        <div className='pokemon-evolution'>
            <div className='pokemon-evolution__header'>
                <div className='pokemon-evolution__header-title'>Evolution {evolutionChain.id}</div>
            </div>
        </div>
    )
}

export default PokemonEvolution;