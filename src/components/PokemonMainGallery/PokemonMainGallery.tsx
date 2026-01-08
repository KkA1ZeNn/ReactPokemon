import type { Pokemon } from '../../api/pokemonApi/pokemonsApi'
import './PokemonMainGallery.css'

interface PokemonMainGalleryProps {
   pokemons: Pokemon[];
}

const PokemonMainGallery = ({ pokemons }: PokemonMainGalleryProps) => {



   return (
      <>
         <div className='content__gallery'>
            <div className='gallery__wrapper'>
               {pokemons.map((pokemon) => {
                  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default || 
                              pokemon.sprites.front_default || 
                              'https://via.placeholder.com/150'; 
                        
                  return (
                  <div key={pokemon.id} className="gallery__item">
                     <img 
                        src={sprite} 
                        alt={pokemon.name}
                     />
                     <h3>{pokemon.name}</h3>
                  </div>
                  );
               })}
            </div>
            <div className='gallery__pagination'></div>
         </div>
      </>
   )
}

export default PokemonMainGallery