import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PokemonMainControl from '../../components/PokemonMainControl/PokemonMainControl';
import PokemonMainGallery from '../../components/PokemonMainGallery/PokemonMainGallery';
import { POKEMON_API } from '../../api/pokemonApi/pokemonsApi';
import type { Pokemon, NamedAPIResource } from '../../api/pokemonApi/pokemonsApi';
import type { PokemonFilters } from '../../types/pokemonFiltes';
import { getPowerLevel } from '../../types/pokemonFiltes';
import './PokemonListPage.css';

const PokemonListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageFromUrl = searchParams.get('page');
    const initialPage = pageFromUrl ? parseInt(pageFromUrl, 10) : 1;

    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [pokemonTypes, setPokemonTypes] = useState<NamedAPIResource[]>([]);
    const [paginationState, setPaginationState] = useState({
        currentPage: initialPage,
        rangeStart: initialPage <= 3 ? 1 : initialPage - 2
    });

    useEffect(() => {
        if (!pageFromUrl) {
            setSearchParams({ page: '1' }, { replace: true });
        }
    }, []);
    const [filters, setFilters] = useState<PokemonFilters>({
        power: 'all',
        rarity: 'all',
        element: []
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const currentPage = paginationState.currentPage;
    const pageRange = { start: paginationState.rangeStart, end: paginationState.rangeStart + 2 };

    const searchPokemons = (pokemons: Pokemon[], search: string) => {
        if (!search) return pokemons;

        return pokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().includes(search.toLowerCase());
        });
    };

    const filterPokemons = (pokemons: Pokemon[], filters: PokemonFilters) => {
        return pokemons.filter((pokemon) => {
            // Фильтр по силе
            const attackStat = pokemon.stats.find((stat) => stat.stat.name === 'attack')?.base_stat;
            if (attackStat === undefined) {
                return false;
            }

            const powerLevel = getPowerLevel(attackStat);
            const passesPowerFilter = filters.power === 'all' || powerLevel === filters.power;

            // Фильтр по редкости
            const passesRarityFilter = filters.rarity === 'all' ||
                (pokemon.rarity && pokemon.rarity === filters.rarity);

            // Фильтр по типу/стихии
            const passesTypeFilter = filters.element.length === 0 ||
                pokemon.types.some(t => filters.element.includes(t.type.name));

            return passesPowerFilter && passesRarityFilter && passesTypeFilter;
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Загрузка типов покемонов при монтировании
    useEffect(() => {
        const loadTypes = async () => {
            try {
                const types = await POKEMON_API.getAllTypes();
                setPokemonTypes(types);
                console.log('Загружены типы покемонов:', types);
            } catch (error) {
                console.error('Ошибка при загрузке типов:', error);
            }
        };

        loadTypes();
    }, []);

    // Загрузка покемонов для галереи С редкостью
    useEffect(() => {
        const getData = async () => {
            try {
                const offset = (currentPage - 1) * 8; // 8 покемонов на странице
                const pokemonsData = await POKEMON_API.getPokemons(8, offset);
                setPokemons(pokemonsData);
                console.log(`Покемоны для страницы ${currentPage}:`, pokemonsData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        }

        getData();
    }, [currentPage])

    // Синхронизируем URL с текущей страницей
    useEffect(() => {
        const pageFromUrl = searchParams.get('page');
        if (!pageFromUrl || pageFromUrl !== currentPage.toString()) {
            setSearchParams({ page: currentPage.toString() }, { replace: true });
        }
    }, [currentPage, searchParams, setSearchParams]);

    // Функции управления пагинацией
    const goToPage = (page: number) => {
        const newRangeStart = page > pageRange.end
            ? paginationState.rangeStart + 1
            : page < pageRange.start
                ? Math.max(1, paginationState.rangeStart - 1)
                : paginationState.rangeStart;

        setPaginationState({
            currentPage: page,
            rangeStart: newRangeStart
        });
    };

    const goToNextPage = () => {
        const nextPage = currentPage + 1;
        const newRangeStart = nextPage > pageRange.end
            ? paginationState.rangeStart + 1
            : paginationState.rangeStart;

        setPaginationState({
            currentPage: nextPage,
            rangeStart: newRangeStart
        });
    };

    const goToPrevPage = () => {
        if (currentPage === 1) return;

        const prevPage = currentPage - 1;
        const newRangeStart = prevPage < pageRange.start
            ? Math.max(1, paginationState.rangeStart - 1)
            : paginationState.rangeStart;

        setPaginationState({
            currentPage: prevPage,
            rangeStart: newRangeStart
        });
    };

    const pokemonsForGallery = useMemo(() => {
        if (pokemons.length === 0) return [];

        const filtered = filterPokemons(pokemons, filters);
        const searched = searchPokemons(filtered, debouncedSearch);

        return searched;
    }, [pokemons, filters, debouncedSearch]);

    return (
        <div className='pokemon-list-page'>
            <div className='content__logo'></div>

            <PokemonMainControl
                filters={filters}
                setFilters={setFilters}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                pokemonTypes={pokemonTypes}
            />

            <PokemonMainGallery
                pokemons={pokemonsForGallery}
                currentPage={currentPage}
                pageRange={pageRange}
                goToPage={goToPage}
                goToNextPage={goToNextPage}
                goToPrevPage={goToPrevPage}
            />
        </div>
    )
}

export default PokemonListPage;
