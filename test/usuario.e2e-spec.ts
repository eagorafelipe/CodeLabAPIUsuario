import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { EMensagem } from 'src/shared/enums/mensagem.enum';
import { ResponseExceptionsFilter } from 'src/shared/filters/response-exception.filter';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import request from 'supertest';
import { Repository } from 'typeorm';

describe('Usuário (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Usuario>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    app.useGlobalFilters(new ResponseExceptionsFilter());

    await app.startAllMicroservices();
    await app.init();

    repository = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  afterAll(async () => {
    await repository.delete({});
    await app.close();
  });

  describe('CRUD de Usuários', () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    let id: number;

    const usuario = {
      nome: `${firstName} ${lastName}`,
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      senha: faker.internet.password(),
      admin: false,
      ativo: true,
    };

    it('criar um novo usuário', async () => {
      const resp = await request(app.getHttpServer())
        .post('/usuario')
        .send(usuario);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.CREATED);
      expect(resp.body.message).toBe(EMensagem.SalvoSucesso);
      expect(resp.body.data).toHaveProperty('id');

      id = resp.body.data.id;
    });

    it('criar um novo usuário usando o mesmo email', async () => {
      const resp = await request(app.getHttpServer())
        .post('/usuario')
        .send(usuario);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.mensagem).toBe(EMensagem.ImpossivelCadastrar);
      expect(resp.body.data).toBe(null);
    });

    it('carregar um usuário', async () => {
      const resp = await request(app.getHttpServer()).get(`/usuario/${id}`);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.OK);
      expect(resp.body.message).toBe(undefined);
      expect(resp.body.data.email).toBe(usuario.email);
      expect(resp.body.data.ativo).toBe(usuario.ativo);
      expect(resp.body.data.admin).toBe(usuario.admin);
      expect(resp.body.data.password).toBe(undefined);
    });

    it('alterar um usuário', async () => {
      const usuarioAlterado = Object.assign(usuario, { id: id, admin: true });
      const resp = await request(app.getHttpServer())
        .patch(`/usuario/${id}`)
        .send(usuarioAlterado);

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.SalvoSucesso);
      expect(resp.body.data.admin).toBe(true);
    });

    it('lançar um erro ao alterar um usuário inexistente', async () => {
      const usuarioAlterado = Object.assign(usuario, { id: id, admin: true });
      const resp = await request(app.getHttpServer())
        .patch(`/usuario/999`)
        .send(usuarioAlterado);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.IDsDiferentes);
      expect(resp.body.data).toBe(null);
    });

    it('lançar um erro ao alterar um usuário utilizando o mesmo email', async () => {
      const firstNameTemp = faker.person.firstName();
      const lastNameTemp = faker.person.lastName();

      const usuarioTemp = {
        nome: `${firstNameTemp} ${lastNameTemp}`,
        email: faker.internet
          .email({ firstName: firstNameTemp, lastName: lastNameTemp })
          .toLowerCase(),
        senha: faker.internet.password(),
        ativo: true,
        admin: false,
      };

      await request(app.getHttpServer()).post('/usuario').send(usuarioTemp);

      const usuarioAlterado = Object.assign(usuario, {
        email: usuarioTemp.email,
      });

      const resp = await request(app.getHttpServer())
        .patch(`/usuario/${id}`)
        .send(usuarioAlterado);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.ImpossivelAlterar);
      expect(resp.body.data).toBe(null);
    });

    it('desativar um usuário', async () => {
      const resp = await request(app.getHttpServer()).delete(`/usuario/${id}`);

      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(EMensagem.DesativadoSucesso);
      expect(resp.body.data).toBe(false);
    });

    it('lançar um erro ao desativar um usuário inexistente', async () => {
      const resp = await request(app.getHttpServer()).delete(`/usuario/999`);

      expect(resp).toBeDefined();
      expect(resp.status).toBe(HttpStatus.NOT_ACCEPTABLE);
      expect(resp.body.message).toBe(EMensagem.ImpossivelDesativar);
      expect(resp.body.data).toBe(null);
    });
  });

  describe('findAll /usuario', () => {
    const usuarios: any[] = [];
    for (let i = 0; i < 10; ++i) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const usuario: any = {
        nome: `${firstName} ${lastName}`,
        email: faker.internet
          .email({ firstName: firstName, lastName: lastName })
          .toLowerCase(),
        senha: faker.internet.password(),
        ativo: true,
        admin: false,
      };

      usuarios.push(usuario);
    }

    it('listar todos os usuários', async () => {
      for (const usuario of usuarios) {
        await request(app.getHttpServer()).post('/usuario').send(usuario);
      }

      const response = await request(app.getHttpServer()).get('/usuario/1/10');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response).toBeDefined();
      expect(response.body.message).toBe(undefined);
      expect(response.body.data.length).toBe(10);
    });

    it('listar usuários com paginação', async () => {
      const resp = await request(app.getHttpServer()).get('/usuario/2/10');
      expect(resp.status).toBe(HttpStatus.OK);
      expect(resp).toBeDefined();
      expect(resp.body.message).toBe(undefined);
      expect(resp.body.data.length).toBe(2);
    });
  });
});
