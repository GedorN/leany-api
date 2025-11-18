import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonService } from './pokemon/pokemon.service';
import { CepService } from './cep/cep.service';
import { CepController } from './cep/cep.controller';

@Module({
  imports: [HttpModule],
  controllers: [PokemonController, CepController],
  providers: [PokemonService, CepService],
  exports: [CepService],
})
export class UtilsModule {}
