import { ApiProperty } from '@nestjs/swagger';

export class CepResponseDto {
  @ApiProperty()
  cep: string;

  @ApiProperty()
  logradouro: string;

  @ApiProperty()
  complemento: string;

  @ApiProperty()
  bairro: string;

  @ApiProperty()
  localidade: string;

  @ApiProperty()
  uf: string;

  @ApiProperty()
  ibge: string;

  @ApiProperty()
  gia: string;

  @ApiProperty()
  ddd: string;

  @ApiProperty()
  siafi: string;
}
