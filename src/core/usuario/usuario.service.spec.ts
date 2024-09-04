import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EMensagem } from 'src/shared/enums/mensagem.enum';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;

  const usuario = {
    id: 0,
    nome: 'Usuário Teste',
    email: 'usuario.teste@test.com.br',
    senha: '123456',
    admin: false,
    ativo: true,
    permissao: [],
  };

  const usuarioDto = {
    id: 1,
    nome: 'Usuário Teste',
    email: 'usuario.teste@test.com.br',
    senha: '123456',
    admin: false,
    ativo: true,
    permissao: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  describe('create', () => {
    it('criar um novo usuário', async () => {
      const mockUsuario = Object.assign(usuario, { id: 1 });
      const spyRepository = jest
        .spyOn(repository, 'save')
        .mockReturnValue(Promise.resolve(mockUsuario));
      const result = await service.create(usuario);

      expect(result).toEqual(mockUsuario);
      expect(spyRepository).toHaveBeenCalledWith(usuario);
    });

    it('ao criar um usuário com email duplicado, retornar um erro', async () => {
      usuario.id = 1;
      const spyRepository = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(usuario));

      try {
        await service.create(usuario);
      } catch (err) {
        expect(err.message).toBe(EMensagem.ImpossivelCadastrar);
        expect(spyRepository).toHaveBeenCalledWith(usuario);
      }
    });
  });

  describe('findAll', () => {
    it('Obter uma listagem de usuários', async () => {
      const usuarioList = [usuarioDto];
      const spyRepositoryFind = jest
        .spyOn(repository, 'find')
        .mockReturnValue(Promise.resolve(usuarioList));

      const result = await service.findAll(1, 10);
      expect(result).toEqual(usuarioList);
      expect(spyRepositoryFind).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('Obter um usuário', async () => {
      const spyRepositoryFindOne = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(usuarioDto));

      const result = await service.findOne(1);
      expect(result).toEqual(usuarioDto);
      expect(spyRepositoryFindOne).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('Alterar um usuário', async () => {
      const mockUsuario = Object.assign(usuarioDto, {});
      const spyRepositoryFindOne = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(mockUsuario));
      const spyRepositorySave = jest
        .spyOn(repository, 'save')
        .mockReturnValue(Promise.resolve(mockUsuario));

      const response = await service.update(1, mockUsuario);
      expect(response).toEqual(mockUsuario);
      expect(spyRepositoryFindOne).toHaveBeenCalled();
      expect(spyRepositorySave).toHaveBeenCalled();
    });

    it('Lançar um erro ao enviar IDs diferetes', async () => {
      try {
        await service.update(999, usuarioDto);
      } catch (err: any) {
        expect(err.message).toBe(EMensagem.IDsDiferentes);
      }
    });

    it('Lançar um erro ao enviar um email duplicado', async () => {
      const usuarioDto2 = {
        id: 2,
        nome: 'Usuário Teste 2',
        email: 'usuario.teste.2@test.com.br',
        senha: 'abcdefg',
        admin: false,
        ativo: true,
        permissao: [],
      };

      const spyRepositoryFindOne = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(usuarioDto2));

      try {
        await service.update(1, usuarioDto);
      } catch (err: any) {
        expect(err.message).toBe(EMensagem.ImpossivelAlterar);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
      }
    });
  });

  describe('unactivate', () => {
    it('Desativar um usuário', async () => {
      const spyRepositoryFindOne = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(usuarioDto) as any);
      const usuarioSave = Object.assign(usuarioDto, { ativo: false });
      const spyRepositorySave = jest
        .spyOn(repository, 'save')
        .mockReturnValue(Promise.resolve(usuarioSave) as any);

      const response = await service.unactivate(1);
      expect(response).toEqual(false);
      expect(spyRepositoryFindOne).toHaveBeenCalled();
      expect(spyRepositorySave).toHaveBeenCalled();
    });

    it('Lançar um erro ao não encontrar o usuário', async () => {
      const spyRepositoryFindOne = jest
        .spyOn(repository, 'findOne')
        .mockReturnValue(Promise.resolve(null) as any);

      try {
        await service.unactivate(1);
      } catch (err: any) {
        expect(err.message).toBe(EMensagem.ImpossivelDesativar);
        expect(spyRepositoryFindOne).toHaveBeenCalled();
      }
    });
  });
});
