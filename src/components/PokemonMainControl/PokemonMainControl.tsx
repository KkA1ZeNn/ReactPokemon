import './PokemonMainControl.css'
import { POWER_FILTERS, RARITY_FILTERS, type PokemonFilters } from '../../types/pokemonFiltes';
import type { NamedAPIResource } from '../../api/pokemonApi/pokemonsApi';
import { TYPE_TRANSLATIONS } from '../../constants/pokemonConstants';
import { useState, useRef, useEffect } from 'react';

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
   const [isElementDropdownOpen, setIsElementDropdownOpen] = useState(false);
   const elementDropdownRef = useRef<HTMLDivElement>(null);

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
   };

   const handlePowerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters({ ...filters, power: event.target.value });
   };

   const handleRarityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters({ ...filters, rarity: event.target.value });
   };

   const handleElementToggle = (typeName: string) => {
      const currentElements = filters.element;
      const newElements = currentElements.includes(typeName)
         ? currentElements.filter(el => el !== typeName)
         : [...currentElements, typeName];
      setFilters({ ...filters, element: newElements });
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (elementDropdownRef.current && !elementDropdownRef.current.contains(event.target as Node)) {
            setIsElementDropdownOpen(false);
         }
      };

      if (isElementDropdownOpen) {
         document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [isElementDropdownOpen]);

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
                  <div className='selectbar__custom-select' ref={elementDropdownRef}>
                     <div
                        className='selectbar__selector selectbar__selector--custom'
                        onClick={() => setIsElementDropdownOpen(!isElementDropdownOpen)}
                     >
                        По стихии
                     </div>
                     {isElementDropdownOpen && (
                        <div className='selectbar__dropdown'>
                           <div className='selectbar__dropdown-content'>
                              {pokemonTypes.map((type) => {
                                 if (TYPE_TRANSLATIONS[type.name]) {
                                    const isSelected = filters.element.includes(type.name);
                                    return (
                                       <label
                                          key={type.name}
                                          className='selectbar__option'
                                       >
                                          <span className='selectbar__option-text'>
                                             {TYPE_TRANSLATIONS[type.name]}
                                          </span>
                                          <input
                                             type="checkbox"
                                             checked={isSelected}
                                             onChange={() => handleElementToggle(type.name)}
                                             className='selectbar__radio'
                                          />
                                       </label>
                                    )
                                 }
                                 return null;
                              })}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default PokemonMainControl
