import request from 'supertest';
import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import AppDataSource from '@/database/data-source';
import { LoginDTO } from '@/dtos/auth.dto';

beforeAll(async () => {
  await AppDataSource.initialize();
  console.log('Data Source has been initialized!');
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  AppDataSource.destroy();
});

describe('Testing Auth', () => {
  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      const userData: LoginDTO = {
        email: 'admin@gmail.com',
        password: '024680',
      };

      const authRoute = new AuthRoute();
      const app = new App([authRoute]);

      return await request(app.getServer())
        .post('/api/v1/login')
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });
});
