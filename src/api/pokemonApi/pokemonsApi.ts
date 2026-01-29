import { getRarityFromSpecies } from '../../types/pokemonFiltes';

interface CachedData<T> {
  data: T;
  timestamp: number;
}

class PokemonsCache {
  private cache = new Map<string, CachedData<unknown>>();
  private ttl: number = 1000 * 60 * 5; // 5 минут

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;

    const isExpired = (Date.now() - cached.timestamp) > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new PokemonsCache();

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
  species: NamedAPIResource; // ссылка на species для получения capture_rate
  rarity: string; 
  evolutionChain: EvolutionChain; 
}
export interface PokemonSpecies {
  id: number;
  name: string;
  capture_rate: number;
  is_legendary: boolean;
  is_mythical: boolean;
  evolution_chain?: NamedAPIResource;
}

export interface TypeListResponse {
  count: number;
  results: NamedAPIResource[];
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

export interface EvolutionChainElement {
  name: string;
  url: string;
}


// Базовая функция для выполнения запросов
async function fetchAPI<T>(url: string): Promise<T> {
  try {
    const cachedData = cache.get<T>(url);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Ошибка при запросе к API: ${response.statusText}`
      );
    }

    const data = await response.json();
    cache.set(url, data);
    return data;
  } catch (error) {
    throw new Error(
      `Не удалось выполнить запрос: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
    );
  }
}

// API функции
export const POKEMON_API = {
  /**
   * Получить ПОЛНУЮ информацию о покемоне 
   * Включает: основную информацию, типы, редкость и цепочку эволюции
   * @param idOrName - ID (число) или имя покемона (строка)
   * @returns Покемон с полной информацией включая редкость и цепочку эволюции
   */
  async getPokemon(idOrName: number | string): Promise<Pokemon> {
    const pokemonData = await fetchAPI<Omit<Pokemon, 'rarity' | 'evolutionChain'>>(
      `${BASE_URL}/pokemon/${idOrName}/`
    );
    
    if (!pokemonData.species?.url) {
      throw new Error('Не удалось получить информацию о виде покемона');
    }
    
    const species = await fetchAPI<PokemonSpecies & { evolution_chain: NamedAPIResource }>(
      pokemonData.species.url
    );
    
    const rarity = getRarityFromSpecies(
      species.is_legendary,
      species.is_mythical
    );
    
    if (!species.evolution_chain?.url) {
      throw new Error('Не удалось получить цепочку эволюции');
    }
    
    const evolutionChain = await fetchAPI<EvolutionChain>(species.evolution_chain.url);
    
    return {
      ...pokemonData,
      rarity,
      evolutionChain,
    };
  },

  /**
   * Получить список покемонов для галереи с полной информацией
   * Включает: основную информацию, типы, редкость и цепочку эволюции для каждого покемона
   * @param limit - Количество покемонов (по умолчанию 8)
   * @param offset - Смещение для пагинации (по умолчанию 0)
   * @returns Массив покемонов с полной информацией включая редкость и цепочку эволюции
   */
  async getPokemons(limit: number = 8, offset: number = 0): Promise<Pokemon[]> {
    const listResponse = await fetchAPI<PokemonListResponse>(
      `${BASE_URL}/pokemon/?limit=${limit}&offset=${offset}`
    );
    
    const promises = listResponse.results.map(async (item) => {
      const id = item.url.split('/').filter(Boolean).pop();
      const pokemonId = id || item.name;
      
      return await this.getPokemon(pokemonId);
    });
    
    return Promise.all(promises);
  },

  /**
   * Получить список всех типов покемонов (fire, water, grass и т.д.)
   * @returns Массив всех доступных типов
   */
  async getAllTypes(): Promise<NamedAPIResource[]> {
    const response = await fetchAPI<TypeListResponse>(`${BASE_URL}/type/`);
    return response.results;
  },

};
