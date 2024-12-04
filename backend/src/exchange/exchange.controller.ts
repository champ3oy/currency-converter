import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ExchangeService } from './exchange.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('exchange-rates')
  getExchangeRates(@Param('base') base: string) {
    return this.exchangeService.getExchangeRates(base ?? 'USD');
  }

  @Post('convert')
  convertCurrency(
    @Request() req,
    @Body() convertCurrencyDto: ConvertCurrencyDto,
  ) {
    return this.exchangeService.convertCurrency(
      req.user.userId,
      convertCurrencyDto.fromCurrency,
      convertCurrencyDto.toCurrency,
      convertCurrencyDto.amount,
    );
  }
}
