import type { Pokemon } from '../../api/pokemonApi/pokemonsApi'
import { useNavigate } from 'react-router-dom'
import './PokemonMainGallery.css'
import { getPokemonInfo } from '../../scripts/pokemonInfo'

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
   const navigate = useNavigate();

   const handleCardClick = (pokemonId: number) => {
      // Сохраняем текущую страницу в URL при переходе
      navigate(`/pokemon/${pokemonId}?page=${currentPage}`);
   };

   return (
      <>
         <div className='content__gallery'>
            <div className='gallery__wrapper'>
               {pokemons.map((pokemon) => {
                  const { sprite, types, attackStat, rarity, cardGradient } = getPokemonInfo(pokemon);

                  return (
                     <div
                        key={pokemon.id}
                        className="gallery__item"
                        style={{ background: cardGradient, cursor: 'pointer' }}
                        onClick={() => handleCardClick(pokemon.id)}
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