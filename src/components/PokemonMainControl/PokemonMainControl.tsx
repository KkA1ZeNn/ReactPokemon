import './PokemonMainControl.css'
import { POWER_FILTERS, RARITY_FILTERS, type PokemonFilters } from '../../types/pokemonFiltes';
import type { NamedAPIResource } from '../../api/pokemonApi/pokemonsApi';

interface PokemonMainControlProps {
   filters: PokemonFilters;
   setFilters: (filters: PokemonFilters) => void;
   searchQuery: string;
   setSearchQuery: (search: string) => void;
   pokemonTypes: NamedAPIResource[]; // Типы покемонов из API
}

const PokemonMainControl = ({
   filters,
   setFilters,
   searchQuery,
   setSearchQuery,
   pokemonTypes
}: PokemonMainControlProps) => {

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
   };

   const handlePowerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters({ ...filters, power: event.target.value });
   };

   const handleRarityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters({ ...filters, rarity: event.target.value });
   };

   const handleElementChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters({ ...filters, element: event.target.value });
   };

   return (
      <>
         <div className='content__control'>
            <div className='control__wrapper'>
               <input
                  className='wrapper__search'
                  type="text"
                  name='search'
                  placeholder='Поиск'
                  value={searchQuery}
                  onChange={handleSearchChange}
               />
               <div className='wrapper__selectbar'>
                  {/* Фильтр по силе */}
                  <select
                     className='selectbar__selector'
                     value={filters.power}
                     onChange={handlePowerChange}
                  >
                     {POWER_FILTERS.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                     ))}
                  </select>

                  {/* Фильтр по редкости */}
                  <select
                     className='selectbar__selector'
                     value={filters.rarity}
                     onChange={handleRarityChange}
                  >
                     {RARITY_FILTERS.options.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                     ))}
                  </select>

                  {/* Фильтр по типу/стихии (загружается из API) */}
                  <select
                     className='selectbar__selector'
                     value={filters.element}
                     onChange={handleElementChange}
                  >
                     <option value="all">Все</option>
                     {pokemonTypes.map((type) => (
                        <option key={type.name} value={type.name}>
                           {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                        </option>
                     ))}
                  </select>
               </div>
            </div>
         </div>
      </>
   )
}

export default PokemonMainControl
