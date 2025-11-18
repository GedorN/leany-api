import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CepService } from './cep.service';
import { CepResponseDto } from './dto/cep-response.dto';

@ApiTags('utils')
@Controller('utils')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get('cep/:cep')
  @ApiOperation({
    summary: 'Search for CEP on an external service',
  })
  async getCep(
    @Param('cep') cep: string,
  ): Promise<CepResponseDto> {
    return this.cepService.lookup(cep);
  }
}
