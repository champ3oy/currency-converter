import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NonceService {
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
    });
  }

  async generateNonce(): Promise<string> {
    const nonce = uuidv4();
    await this.redis.set(
      `nonce:${nonce}`,
      'valid',
      'EX',
      300 // 5 minutes expiration
    );
    return nonce;
  }

  async validateAndInvalidateNonce(nonce: string): Promise<boolean> {
    const key = `nonce:${nonce}`;
    const isValid = await this.redis.get(key);
    
    if (isValid) {
      await this.redis.del(key);
      return true;
    }
    
    return false;
  }
}