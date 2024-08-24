import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { EMensagem } from 'src/shared/enums/mensagem.enum';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            unactivate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<UsuarioService>(UsuarioService);
  });

  const createUsuarioDto = {
    nome: 'Nome Teste',
    email: 'email.teste@test.com.br',
    senha: '123456',
    admin: false,
    ativo: true,
    permissao: [],
  };

  describe('create', () => {
    it('criar um nono usuário', async () => {
      const mockUsuario = Object.assign(createUsuarioDto, { id: 1 });
      const spyService = jest
        .spyOn(service, 'create')
        .mockReturnValue(Promise.resolve(mockUsuario));

      const response = await controller.create(createUsuarioDto);

      expect(spyService).toHaveBeenCalledWith(createUsuarioDto);
      expect(response.data).toEqual(mockUsuario);
      expect(response.message).toBe(EMensagem.SalvoSucesso);
    });
  });

  describe('findAll', () => {
    it('obter uma listagem de usuários', async () => {
      let listUsuario: any[];
      listUsuario.push(createUsuarioDto);

      const spyService = jest
        .spyOn(service, 'findAll')
        .mockReturnValue(Promise.resolve(listUsuario));

      const response = await controller.findAll(1, 10, null, null);

      expect(spyService).toHaveBeenCalledWith(1, 10);
      expect(response.data).toEqual(listUsuario);
      expect(response.message).toBe(undefined);
    });
  });

  describe('findOne', () => {
    it('obter um usuário', async () => {
      const spyServiceFindOne = jest
        .spyOn(service, 'findOne')
        .mockReturnValue(Promise.resolve(createUsuarioDto) as any);

      const response = await controller.findOne(1);

      expect(spyServiceFindOne).toHaveBeenCalledWith(1);
      expect(response.data).toEqual(createUsuarioDto);
      expect(response.message).toBe(undefined);
    });
  });

  describe('update', () => {
    it('atualiza um usuário', async () => {
      const mockUsuario = Object.assign(createUsuarioDto, { id: 1 });

      const spyServiceUpdate = jest
        .spyOn(service, 'update')
        .mockReturnValue(Promise.resolve(mockUsuario) as any);

      const response = await controller.update(1, mockUsuario);

      expect(spyServiceUpdate).toHaveBeenCalled();
      expect(response.data).toEqual(mockUsuario);
      expect(response.message).toBe(EMensagem.AtualizadoSucesso);
    });
  });

  describe('unactivage', () => {
    it('desativar um usuário', async () => {
      const spyServiceUnactivate = jest
        .spyOn(service, 'unactivate')
        .mockReturnValue(Promise.resolve(false) as any);

      const response = await controller.unactivate(1);

      expect(spyServiceUnactivate).toHaveBeenCalled();
      expect(response.data).toEqual(false);
      expect(response.message).toBe(EMensagem.DesativadoSucesso);
    });
  });
});
