import { useEffect, useState } from 'react';
import PokemonMainControl from '../PokemonMainControl/PokemonMainControl';
import PokemonMainGallery from '../PokemonMainGallery/PokemonMainGallery';
import { POKEMON_API } from '../../api/pokemonApi/pokemonsApi';
import type { Pokemon } from '../../api/pokemonApi/pokemonsApi';

import './PokemonMain.css'


const PokemonMain = () => {

   const [pokemons, setPokemons] = useState<Pokemon[]>([]);

   useEffect(() => {
      const getData = async() => {
         try {
            // Получение 8 покемонов для галереи с полной информацией 
            const pokemonsData = await POKEMON_API.getPokemonsForGallery(0);
            setPokemons(pokemonsData);
            console.log('Покемоны для галереи:', pokemonsData);
         } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
         }
      }

      getData();
   }, [])

   return (
      <>
         <div className='pokemon-main__content'>
            <div className='content__logo'></div>
            <PokemonMainControl />
            <PokemonMainGallery pokemons={pokemons}/>
         </div>
      </>
   )
}

export default PokemonMain;