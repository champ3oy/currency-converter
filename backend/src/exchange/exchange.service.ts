import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import axios from 'axios';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getExchangeRates(from: string) {
    try {
      const OER_URL = `${process.env.EXCHANGE_API_URL2}/${process.env.EXCHANGE_API_KEY2}/latest/${from}`;
      const response = await axios.get(OER_URL);
      return response.data?.conversion_rates;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch exchange rates',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateCurrencies(fromCurrency: string, toCurrency: string) {
    try {
      const rates = await this.getExchangeRates(fromCurrency);
      if (!rates[fromCurrency] || !rates[toCurrency]) {
        throw new HttpException(
          'Invalid currency code',
          HttpStatus.BAD_REQUEST,
        );
      }
      return rates;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to validate currencies',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async convertCurrency(
    userId: number,
    from: string,
    to: string,
    amount: number,
  ) {
    try {
      const rates = await this.validateCurrencies(from, to);

      const baseAmount = amount / rates[from];
      const convertedAmount = baseAmount * rates[to];
      const rate = rates[to] / rates[from];

      const transaction = this.transactionRepository.create({
        userId,
        fromCurrency: from,
        toCurrency: to,
        amount,
        convertedAmount,
        rate,
      });

      await this.transactionRepository.save(transaction);
      return transaction;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Currency conversion failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
