// Базовый URL API
const BASE_URL = 'https://pokeapi.co/api/v2';

// Типы для API ответов
export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
  abilities: Array<{
    ability: NamedAPIResource;
    is_hidden: boolean;
    slot: number;
  }>;
}

// Типы для цепочки эволюции
export interface EvolutionChainLink {
  species: NamedAPIResource;
  evolves_to: EvolutionChainLink[];
  evolution_details?: Array<{
    min_level: number | null;
    trigger: NamedAPIResource;
  }>;
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionChainLink;
}

export interface PokemonWithEvolution {
  pokemon: Pokemon;
  evolutionChain: EvolutionChain;
}


// Базовая функция для выполнения запросов
async function fetchAPI<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(
        `Ошибка при запросе к API: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    throw new Error(
      `Не удалось выполнить запрос: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
    );
  }
}

// API функции
export const POKEMON_API = {
     /**
   * Получить информацию о конкретном покемоне 
   * @param idOrName - ID (число) или имя покемона (строка)
   * @returns Покемон с полной информацией 
   */
   async getPokemon(idOrName: number | string): Promise<Pokemon> {
      return await fetchAPI<Pokemon>(`${BASE_URL}/pokemon/${idOrName}/`);
   },

  /**
   * Получить 8 покемонов для галереи 
   * @param offset - Смещение для пагинации (по умолчанию 0)
   * @returns Массив покемонов с полной информацией
   */
   async getPokemonsForGallery(offset: number = 0): Promise<Pokemon[]> {
      const listResponse = await fetchAPI<PokemonListResponse>(
         `${BASE_URL}/pokemon/?limit=8&offset=${offset}`
      );
      
      const promises = listResponse.results.map(async (item) => {
         const id = item.url.split('/').filter(Boolean).pop();
         return this.getPokemon(id || item.name);
      });
      
      return Promise.all(promises);
   },

  /**
   * Получить информацию о покемоне и его цепочке эволюции 
   * @param idOrName - ID (число) или имя покемона (строка)
   * @returns Покемон с полной информацией и цепочкой эволюции
   */
  async getPokemonWithEvolution(idOrName: number | string): Promise<PokemonWithEvolution> {
    const pokemon = await this.getPokemon(idOrName);
    
    const pokemonData = await 
    fetchAPI<{ species: NamedAPIResource }>(
      `${BASE_URL}/pokemon/${idOrName}/`
    );
    
    if (!pokemonData.species?.url) {
      throw new Error('Не удалось получить информацию о виде покемона');
    }
    
    // Получаем информацию о виде
    const species = await fetchAPI<{ evolution_chain: NamedAPIResource }>(
      pokemonData.species.url
    );
    
    if (!species.evolution_chain?.url) {
      throw new Error('Не удалось получить цепочку эволюции');
    }
    
    const evolutionChain = await fetchAPI<EvolutionChain>(species.evolution_chain.url);
    
    return {
      pokemon,
      evolutionChain,
    };
  },
};
