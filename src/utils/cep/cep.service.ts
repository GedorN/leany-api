import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CepResponseDto } from './dto/cep-response.dto';

@Injectable()
export class CepService {
  constructor(private readonly http: HttpService) {}

  async lookup(cep: string): Promise<CepResponseDto> {
    // Remove everything that is not a number
    const normalized = cep.replace(/\D/g, '');

    if (normalized.length !== 8) {
      throw new BadRequestException('CEP must have 8 digits');
    }

    const url = `https://viacep.com.br/ws/${normalized}/json/`;

    try {
      const { data } = await firstValueFrom(this.http.get(url));

      if (data?.erro) {
        throw new NotFoundException(`CEP ${normalized} not found`);
      }

      return data as CepResponseDto;
    } catch (error) {
      if (error?.status && error?.response) {
        throw error;
      }

      throw new BadGatewayException('Error while calling CEP provider');
    }
  }
}
