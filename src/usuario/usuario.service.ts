import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EMensagem } from 'src/shared/enums/mensagem.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { IFindAllFilter } from 'src/shared/interfaces/find-all-filter.interface';
import { IFindAllOrder } from 'src/shared/interfaces/find-all-order.interface';
import { handleFilter } from 'src/shared/helpers/sql.helper';
import { UsuarioPermissao } from './entities/usuario-permissao.entity';
import { RecuperacaoSenha } from 'src/core/recuperacao-senha/entities/recuperacao-senha.entity';
import { AlterarSenhaUsuarioDto } from './dto/alterar-senha-usuario.dto';

@Injectable()
export class UsuarioService {
  @InjectRepository(Usuario)
  private readonly repository: Repository<Usuario>;

  @InjectRepository(UsuarioPermissao)
  private readonly permissaoRepository: Repository<UsuarioPermissao>;

  @InjectRepository(RecuperacaoSenha)
  private readonly recuperacaoSenhaRepository: Repository<RecuperacaoSenha>;

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

    const usuario = new Usuario(createUsuarioDto);
    usuario.senha = bcrypt.hashSync(usuario.senha);
    const created = this.repository.create(usuario);
    return await this.repository.save(created);
  }

  async findAll(
    page: number,
    size: number,
    order: IFindAllOrder,
    filter?: IFindAllFilter | IFindAllFilter[],
  ): Promise<Usuario[]> {
    page--;
    const where = handleFilter(filter);
    return await this.repository.find({
      loadEagerRelations: false,
      order: { [order.column]: order.sort },
      where,
      skip: size * page,
      take: size,
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

    await this.permissaoRepository.delete({ idUsuario: id });
    for (const permissao in updateUsuarioDto.permissao) {
      Object.assign(updateUsuarioDto.permissao[permissao], { idUsuario: id });
    }

    updateUsuarioDto.senha = bcrypt.hashSync(updateUsuarioDto.senha);

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

  async alterarSenha(
    alterarSenhaUsuarioDto: AlterarSenhaUsuarioDto,
  ): Promise<boolean> {
    const findedToken = await this.recuperacaoSenhaRepository.findOne({
      where: {
        email: alterarSenhaUsuarioDto.email,
        id: alterarSenhaUsuarioDto.token,
      },
    });

    if (!findedToken) {
      throw new HttpException(
        EMensagem.ImpossivelAlterar,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const msInHoras = 60 * 60 * 100;
    const diffHoras =
      Math.abs(Number(new Date()) - Number(findedToken.dataCriacao)) /
      msInHoras;

    if (diffHoras > 24) {
      throw new HttpException(
        EMensagem.TokenInvalido,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    const usuario = await this.repository.findOne({
      where: { email: alterarSenhaUsuarioDto.email },
    });
    usuario.senha = bcrypt.hashSync(alterarSenhaUsuarioDto.senha);
    await this.repository.save(usuario);
    await this.recuperacaoSenhaRepository.delete({ id: findedToken.id });

    return true;
  }
}
