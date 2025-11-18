import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SearchPokemonDto } from './dto/search-pokemon.dto';

const POKE_API_BASE = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonPageResult {
  page: number;
  limit: number;
  total: number;
  results: PokemonListItem[];
}

@Injectable()
export class PokemonService {
  constructor(private readonly http: HttpService) {}

  async searchPokemon(query: SearchPokemonDto): Promise<PokemonPageResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const nameFilter = query.name?.toLowerCase();
    const typeFilter = query.type?.toLowerCase();

    try {
      let pokemons: PokemonListItem[] = [];
      let total = 0;

      if (typeFilter) {
        const url = `${POKE_API_BASE}/type/${typeFilter}`;
        const { data } = await firstValueFrom(this.http.get(url));

        const allOfType: PokemonListItem[] = data.pokemon.map(
          (p) => p.pokemon,
        );

        let filtered = allOfType;
        if (nameFilter) {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(nameFilter),
          );
        }

        total = filtered.length;

        const start = (page - 1) * limit;
        const end = start + limit;

        pokemons = filtered.slice(start, end);
      } else if (nameFilter) {
        const url = `${POKE_API_BASE}/pokemon?offset=0&limit=100000`;
        const { data } = await firstValueFrom(this.http.get(url));

        const all: PokemonListItem[] = data.results;

        const filtered = all.filter((p) =>
          p.name.toLowerCase().includes(nameFilter),
        );

        total = filtered.length;

        const start = (page - 1) * limit;
        const end = start + limit;

        pokemons = filtered.slice(start, end);
      } else {
        const offset = (page - 1) * limit;
        const url = `${POKE_API_BASE}/pokemon?offset=${offset}&limit=${limit}`;
        const { data } = await firstValueFrom(this.http.get(url));

        pokemons = data.results;
        total = data.count;
      }

      return {
        page,
        limit,
        total,
        results: pokemons,
      };
    } catch (err) {
      throw new BadGatewayException('Error while calling PokeAPI');
    }
  }

}
