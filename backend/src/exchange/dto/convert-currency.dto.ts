import { IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertCurrencyDto {
  @ApiProperty({
    example: 'USD',
    description: 'Source currency code',
  })
  @IsString()
  fromCurrency: string;

  @ApiProperty({
    example: 'EUR',
    description: 'Target currency code',
  })
  @IsString()
  toCurrency: string;

  @ApiProperty({
    example: 100,
    description: 'Amount to convert',
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
