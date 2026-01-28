import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { POKEMON_API } from '../../api/pokemonApi/pokemonsApi';
import type { Pokemon, EvolutionChain } from '../../api/pokemonApi/pokemonsApi';
import PokemonEvolution from '../../components/PokemonEvolution/PokemonEvolution';
import PokemonInfo from '../../components/PokemonInfo/PokemonInfo';
import './PokemonDetailPage.css';

const PokemonDetailPage = () => {
   const { id } = useParams<{ id: string }>();
   const [pokemon, setPokemon] = useState<Pokemon | null>(null);
   const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (id) {
         const getData = async () => {
            setLoading(true);
            try {
               const data = await POKEMON_API.getPokemonFullInfo(id);
               console.log('Полная информация о покемоне:', data);
               setPokemon(data.pokemon);
               setEvolutionChain(data.evolutionChain);
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
            <div className='content__logo detail-page'></div>
            {pokemon && (
               <div className='pokemon-info-container'>
                  <PokemonInfo pokemon={pokemon} />
               </div>
            )}
            {evolutionChain && (
               <div className='pokemon-evolution-container'>
                  <PokemonEvolution evolutionChain={evolutionChain} />
               </div>
            )}
         </div>
      </>
   );
};

export default PokemonDetailPage;
