import request from 'supertest';
import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import AppDataSource from '@/database/data-source';

beforeAll(async () => {
  await AppDataSource.initialize();
  console.log('Data Source has been initialized!');
});

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
  AppDataSource.destroy();
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response statusCode 200 / findAll', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return await request(app.getServer()).get(`/api/v1/${usersRoute.path}`).expect(200);
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 / findOne', async () => {
      const usersRoute = new UserRoute();
      const app = new App([usersRoute]);

      return await request(app.getServer())
        .get(`/api/v1/${usersRoute.path}`)
        .query({
          userId: 1,
        })
        .expect(200);
    });
  });
});
