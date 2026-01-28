import type { Pokemon } from '../../api/pokemonApi/pokemonsApi'
import {
   TYPE_TRANSLATIONS,
   RARITY_TRANSLATIONS,
   TYPE_GRADIENTS,
   RARITY_GRADIENTS
} from '../../constants/pokemonConstants'
import './PokemonMainGallery.css'

interface PokemonMainGalleryProps {
   pokemons: Pokemon[];
   currentPage: number;
   pageRange: { start: number; end: number };
   goToPage: (page: number) => void;
   goToNextPage: () => void;
   goToPrevPage: () => void;
}

const PokemonMainGallery = ({
   pokemons,
   currentPage,
   pageRange,
   goToPage,
   goToNextPage,
   goToPrevPage
}: PokemonMainGalleryProps) => {

   return (
      <>
         <div className='content__gallery'>
            <div className='gallery__wrapper'>
               {pokemons.map((pokemon) => {
                  const sprite = pokemon.sprites.other?.['official-artwork']?.front_default ||
                     pokemon.sprites.front_default ||
                     'https://via.placeholder.com/150';

                  const attackStat = pokemon.stats.find((stat) => stat.stat.name === 'attack')?.base_stat || 0;

                  const types = pokemon.types
                     .map(t => TYPE_TRANSLATIONS[t.type.name] || t.type.name)
                     .join(' + ');

                  const rarity = pokemon.rarity ? RARITY_TRANSLATIONS[pokemon.rarity] || pokemon.rarity : 'Обычный';

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

                  return (
                     <div
                        key={pokemon.id}
                        className="gallery__item"
                        style={{ background: cardGradient }}
                     >
                        <div className="item__rarity">{rarity}</div>
                        <div className="item__image">
                           <img
                              src={sprite}
                              alt={pokemon.name}
                           />
                        </div>
                        <h3 className="item__name">{pokemon.name}</h3>
                        <div className="item__stats">
                           <div className="stats__badge">
                              Сила {attackStat}
                           </div>
                           <div className="stats__badge">
                              {types}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
            <div className='gallery__pagination'>
               <div className='pagination__pages'>
                  {[pageRange.start, pageRange.start + 1, pageRange.start + 2].map((page) => (
                     <button
                        key={page}
                        className={`pagination__page ${currentPage === page ? 'active' : ''}`}
                        onClick={() => goToPage(page)}
                     >
                        {page}
                     </button>
                  ))}
               </div>

               <div className='pagination__arrows'>
                  <button
                     className='pagination__arrow'
                     onClick={goToPrevPage}
                     disabled={currentPage === 1}
                  >
                     ←
                  </button>
                  <button
                     className='pagination__arrow'
                     onClick={goToNextPage}
                  >
                     →
                  </button>
               </div>
            </div>
         </div>
      </>
   )
}

export default PokemonMainGallery