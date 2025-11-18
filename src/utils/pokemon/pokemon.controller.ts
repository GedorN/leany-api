import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PokemonService, PokemonPageResult } from './pokemon.service';
import { SearchPokemonDto } from './dto/search-pokemon.dto';

@ApiTags('utils')
@Controller('utils')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('pokemon')
  @ApiOperation({
    summary: 'Search by a Pokémon in PokeAPI, with filters and pagination',
  })
  searchPokemon(
    @Query() query: SearchPokemonDto,
  ): Promise<PokemonPageResult> {
    return this.pokemonService.searchPokemon(query);
  }
}

