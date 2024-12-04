import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let moduleFixture: TestingModule;

  const mockUser = {
    email: 'test12312312sd@email.com',
    password: 'password123',
  };

  const makeAuthenticatedRequest = async (
    method: 'get' | 'post',
    url: string,
    data?: any,
  ) => {
    const req = request(app.getHttpServer())
      [method](url)
      .set('Authorization', `Bearer ${authToken}`);

    if (data && method === 'post') {
      req.send(data);
    }

    const response = await req;

    const newToken = response.headers['new-access-token'];
    if (newToken) {
      authToken = newToken;
    }

    return response;
  };

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('/auth/login (POST) - success', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(mockUser)
        .expect(201);

      expect(response.body.access_token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(mockUser.email);
      authToken = response.body.access_token;
    });

    it('/auth/login (POST) - failure with wrong password', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: mockUser.email,
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('/auth/login (POST) - failure with invalid input', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'not-an-email',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('Exchange Rates', () => {
    it('/exchange-rates (GET) - success with auth', async () => {
      const response = await makeAuthenticatedRequest('get', '/exchange-rates');

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body.USD).toBeDefined();
    });

    it('/exchange-rates (GET) - failure without auth', async () => {
      return request(app.getHttpServer()).get('/exchange-rates').expect(401);
    });
  });

  describe('Currency Conversion', () => {
    it('/convert (POST) - success', async () => {
      const conversionData = {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: 100,
      };

      const response = await makeAuthenticatedRequest(
        'post',
        '/convert',
        conversionData,
      );
      expect(response.status).toBe(201);
      expect(response.body.fromCurrency).toBe(conversionData.fromCurrency);
      expect(response.body.toCurrency).toBe(conversionData.toCurrency);
      expect(response.body.amount).toBe(conversionData.amount);
      expect(response.body.convertedAmount).toBeDefined();
      expect(response.body.rate).toBeDefined();
    });

    it('/convert (POST) - failure with invalid currency', async () => {
      const invalidData = {
        fromCurrency: 'INVALID',
        toCurrency: 'EUR',
        amount: 100,
      };

      const response = await makeAuthenticatedRequest(
        'post',
        '/convert',
        invalidData,
      );
      expect(response.status).toBe(400);
    });

    it('/convert (POST) - failure with negative amount', async () => {
      const invalidData = {
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        amount: -100,
      };

      const response = await makeAuthenticatedRequest(
        'post',
        '/convert',
        invalidData,
      );
      expect(response.status).toBe(400);
    });
  });

  describe('Transaction History', () => {
    it('/user/transactions (GET) - success', async () => {
      const response = await makeAuthenticatedRequest(
        'get',
        '/user/transactions',
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('fromCurrency');
        expect(response.body[0]).toHaveProperty('toCurrency');
        expect(response.body[0]).toHaveProperty('amount');
        expect(response.body[0]).toHaveProperty('convertedAmount');
        expect(response.body[0]).toHaveProperty('rate');
        expect(response.body[0]).toHaveProperty('createdAt');
      }
    });

    it('/user/transactions (GET) - failure without auth', async () => {
      return request(app.getHttpServer()).get('/user/transactions').expect(401);
    });
  });

  describe('Nonce Validation', () => {
    it('should prevent replay attacks by rejecting reused tokens', async () => {
      const oldToken = authToken;

      const response = await makeAuthenticatedRequest('get', '/exchange-rates');
      expect(response.status).toBe(200);

      const replayResponse = await request(app.getHttpServer())
        .get('/exchange-rates')
        .set('Authorization', `Bearer ${oldToken}`)
        .expect(401);

      expect(replayResponse.body.message).toContain('Invalid or expired token');
    });

    it('should successfully make multiple sequential requests', async () => {
      const response = await makeAuthenticatedRequest('get', '/exchange-rates');
      expect(response.status).toBe(200);

      const response2 = await makeAuthenticatedRequest(
        'get',
        '/exchange-rates',
      );
      expect(response2.status).toBe(200);

      const response3 = await makeAuthenticatedRequest(
        'get',
        '/exchange-rates',
      );
      expect(response3.status).toBe(200);
    });
  });
});
