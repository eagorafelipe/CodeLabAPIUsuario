import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { EMensagem } from 'src/shared/enums/mensagem.enum';

@Injectable()
export class UsuarioService {
  @InjectRepository(Usuario)
  private readonly repository: Repository<Usuario>;

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const findedUsuario = await this.repository.findOne({
      where: { email: createUsuarioDto.email },
    });
    if (findedUsuario) {
      throw new HttpException(
        EMensagem.ImpossivelCadastrar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const createUsuario = this.repository.create(createUsuarioDto);
    return await this.repository.save(createUsuario);
  }

  async findAll(page: number, size: number): Promise<Usuario[]> {
    page--;
    return await this.repository.find({
      loadEagerRelations: false,
      skip: size * page || 0,
      take: size || 10,
    });
  }

  async findOne(id: number): Promise<Usuario> {
    return await this.repository.findOneBy({ id });
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    if (id !== updateUsuarioDto.id) {
      throw new HttpException(
        EMensagem.IDsDiferentes,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return await this.repository.save(updateUsuarioDto);
  }
  async unactivate(id: number): Promise<boolean> {
    const findedUsuario = await this.repository.findOneBy({ id });
    if (!findedUsuario) {
      throw new HttpException(
        EMensagem.ImpossivelDesativar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    findedUsuario.ativo = false;
    return (await this.repository.save(findedUsuario)).ativo;
  }
}
