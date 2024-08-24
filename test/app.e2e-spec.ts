import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseExceptionsFilter } from 'src/shared/filters/response-exception.filter';
import { ResponseTransformInterceptor } from 'src/shared/interceptors/response-transform.interceptor';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ApiUsuario (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new ResponseExceptionsFilter());
    await app.init();
  });

  it('/ (GET)', async () => {
    const retorno = await request(app.getHttpServer()).get('/');
    expect(retorno).toBeDefined();
    expect(retorno.status).toBe(200);
    expect(retorno.body.message).toBe(null);
    expect(retorno.body.data).toBe('Hello, CodeLabApiUsuario!');
  });
});
