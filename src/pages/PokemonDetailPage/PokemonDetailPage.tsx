import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { POKEMON_API } from '../../api/pokemonApi/pokemonsApi';
import type { Pokemon, EvolutionChain } from '../../api/pokemonApi/pokemonsApi';
import { TYPE_TRANSLATIONS, RARITY_TRANSLATIONS } from '../../constants/pokemonConstants';
import './PokemonDetailPage.css';

const PokemonDetailPage = () => {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   
   const [pokemon, setPokemon] = useState<Pokemon | null>(null);
   const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const loadPokemonData = async () => {
         if (!id) {
            setError('ID покемона не указан');
            setLoading(false);
            return;
         }

         setLoading(true);
         setError(null);

         try {
            const data = await POKEMON_API.getPokemonWithEvolution(id);
            setPokemon(data.pokemon);
            setEvolutionChain(data.evolutionChain);
            console.log('Загружены данные покемона:', data);
         } catch (err) {
            console.error('Ошибка загрузки покемона:', err);
            setError('Не удалось загрузить данные покемона');
         } finally {
            setLoading(false);
         }
      };

      loadPokemonData();
   }, [id]);

   if (loading) {
      return (
         <div className="pokemon-detail-page">
            <div className="loading">Загрузка...</div>
         </div>
      );
   }

   if (error || !pokemon) {
      return (
         <div className="pokemon-detail-page">
            <button className="back-button" onClick={() => navigate('/')}>
               ← Назад к списку
            </button>
            <div className="error">{error || 'Покемон не найден'}</div>
         </div>
      );
   }

   // Получаем данные покемона
   const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || 
                    pokemon.sprites.front_default || '';
   const attackStat = pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
   const defenseStat = pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0;
   const hpStat = pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0;
   const speedStat = pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0;

   // Функция для рекурсивного обхода цепочки эволюции
   const renderEvolutionChain = (chain: any, level = 0): JSX.Element[] => {
      const elements: JSX.Element[] = [];
      
      elements.push(
         <div key={chain.species.name} className="evolution-item" style={{ marginLeft: `${level * 20}px` }}>
            <span className="evolution-name">{chain.species.name}</span>
            {chain.evolution_details && chain.evolution_details[0]?.min_level && (
               <span className="evolution-level"> (ур. {chain.evolution_details[0].min_level})</span>
            )}
         </div>
      );

      if (chain.evolves_to && chain.evolves_to.length > 0) {
         chain.evolves_to.forEach((evolution: any) => {
            elements.push(...renderEvolutionChain(evolution, level + 1));
         });
      }

      return elements;
   };

   return (
      <div className="pokemon-detail-page">
         <button className="back-button" onClick={() => navigate('/')}>
            ← Назад к списку
         </button>

         <div className="pokemon-detail-content">
            <div className="pokemon-header">
               <h1 className="pokemon-name">{pokemon.name}</h1>
               {pokemon.rarity && (
                  <span className="pokemon-rarity">
                     {RARITY_TRANSLATIONS[pokemon.rarity] || pokemon.rarity}
                  </span>
               )}
            </div>

            <div className="pokemon-main-info">
               <div className="pokemon-image-section">
                  {imageUrl && (
                     <img 
                        src={imageUrl} 
                        alt={pokemon.name}
                        className="pokemon-image"
                     />
                  )}
               </div>

               <div className="pokemon-stats-section">
                  <h2>Характеристики</h2>
                  <div className="stats-grid">
                     <div className="stat-item">
                        <span className="stat-label">HP:</span>
                        <span className="stat-value">{hpStat}</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Атака:</span>
                        <span className="stat-value">{attackStat}</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Защита:</span>
                        <span className="stat-value">{defenseStat}</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Скорость:</span>
                        <span className="stat-value">{speedStat}</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Рост:</span>
                        <span className="stat-value">{pokemon.height / 10} м</span>
                     </div>
                     <div className="stat-item">
                        <span className="stat-label">Вес:</span>
                        <span className="stat-value">{pokemon.weight / 10} кг</span>
                     </div>
                  </div>

                  <div className="pokemon-types">
                     <h3>Типы:</h3>
                     <div className="types-list">
                        {pokemon.types.map((typeInfo) => (
                           <span key={typeInfo.type.name} className="type-badge">
                              {TYPE_TRANSLATIONS[typeInfo.type.name] || typeInfo.type.name}
                           </span>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {evolutionChain && (
               <div className="evolution-section">
                  <h2>Цепочка эволюции</h2>
                  <div className="evolution-chain">
                     {renderEvolutionChain(evolutionChain.chain)}
                  </div>
               </div>
            )}

            <div className="abilities-section">
               <h2>Способности</h2>
               <div className="abilities-list">
                  {pokemon.abilities.map((abilityInfo) => (
                     <div key={abilityInfo.ability.name} className="ability-item">
                        <span className="ability-name">{abilityInfo.ability.name}</span>
                        {abilityInfo.is_hidden && (
                           <span className="ability-hidden"> (скрытая)</span>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default PokemonDetailPage;
