import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { POKEMON_API } from '../../api/pokemonApi/pokemonsApi';
import type { Pokemon, EvolutionChainLink, EvolutionChainElement } from '../../api/pokemonApi/pokemonsApi';
import PokemonEvolution from '../../components/PokemonEvolution/PokemonEvolution';
import PokemonInfo from '../../components/PokemonInfo/PokemonInfo';
import './PokemonDetailPage.css';

const parseEvolutionChain = (chain: EvolutionChainLink): EvolutionChainElement[] => {
   const result: EvolutionChainElement[] = [{ name: chain.species.name, url: chain.species.url }];

   for (const evolution of chain.evolves_to) {
      result.push(...parseEvolutionChain(evolution).map(e => ({ name: e.name, url: e.url })));
   }

   return result;
}

const PokemonDetailPage = () => {
   const { id } = useParams<{ id: string }>();
   const [pokemon, setPokemon] = useState<Pokemon | null>(null);
   const [evolutionChain, setEvolutionChain] = useState<EvolutionChainElement[] | null>(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      if (id) {
         const getData = async () => {
            setLoading(true);
            try {
               const data = await POKEMON_API.getPokemon(id);
               const evolutionChainElements = parseEvolutionChain(data.evolutionChain.chain);
               setPokemon(data);
               setEvolutionChain(evolutionChainElements);

               console.log('Полная информация о покемоне:', data);
               console.log('Цепочка эволюции:', evolutionChainElements);

            } catch (error) {
               console.error('Ошибка при загрузке данных:', error);
            } finally {
               setLoading(false);
            }
         }
         getData();
      }
   }, [id]);

   if (loading) {
      return (
         <div className='pokemon-detail-page'>
            <div className='loading'>Загрузка...</div>
         </div>
      );
   }

   return (
      <>
         <div className='pokemon-detail-page'>
            <div className='content__logo detail-page' onClick={() => navigate('/')}></div>
            {pokemon && (
               <>
                  <div className='pokemon-info-container'>
                     <PokemonInfo pokemon={pokemon} />
                  </div>
                  {evolutionChain && (
                     <div className='pokemon-evolution-container'>
                        <PokemonEvolution evolutionChain={evolutionChain} currentPokemonId={pokemon.id} />
                     </div>
                  )}
               </>
            )}
         </div>
      </>
   );
};

export default PokemonDetailPage;
