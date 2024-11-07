import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: string;
  let taskId: string;

  const testUser = {
    email: 'test@test.com',
    password: 'test-pass',
    username: 'test name',
  };

  const testTask = {
    title: 'some task',
    description: 'some description',
    endDate: '2024-12-24T00:00:00.000Z',
    state: 'PENDING',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ (GET)', () => {
    it('should return "Hello World!"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('/users', () => {
    it('/register (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.email).toBe(testUser.email);
    });

    it('/login (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      userId = response.body.user;
      expect(userId).toBeDefined();

      token = response.headers['auth-token'];
      expect(token).toBeDefined();
    });
  });

  describe('/tasks', () => {
    it('(POST) should create a new task', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('auth-token', token)
        .send(testTask)
        .expect(201);

      taskId = response.body._id;

      expect(response.body).toHaveProperty('_id');
      expect(response.body.userId).toBe(userId);
    });

    it('(GET) should retrieve all tasks', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('auth-token', token)
        .expect(200);

      expect(response.body.results).toBeInstanceOf(Array);
      expect(response.body.results.length).toBeGreaterThan(0);

      response.body.results.forEach((task: any) => {
        expect(task).toHaveProperty('userId', userId);
      });
    });

    it('/:id (GET) should retrieve a specific task by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('auth-token', token)
        .expect(200);

      expect(response.body.userId).toBe(userId);
      expect(response.body._id).toBe(taskId);
    });

    it('/:id (PUT) should update a task', async () => {
      const updatedTask = { ...testTask, title: 'some task - EDITED' };
      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .set('auth-token', token)
        .send(updatedTask)
        .expect(200);

      expect(response.body.userId).toBe(userId);
      expect(response.body.title).toBe(updatedTask.title);
    });

    it('/:id (DELETE) should delete a task', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('auth-token', token)
        .expect(200);

      expect(response.body).toHaveProperty('_id', taskId);
    });
  });
});
