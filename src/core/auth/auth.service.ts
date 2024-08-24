import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { EMensagem } from '../../shared/enums/mensagem.enum';
import { LoginDto } from './dto/login.dto';
import { ILoginPayload } from 'src/shared/interfaces/login-payload.interface';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  @InjectRepository(Usuario)
  private usuarioRepository: Repository<Usuario>;

  async login(loginDto: LoginDto): Promise<ILoginPayload> {
    const finded = await this.usuarioRepository.findOne({
      select: ['id', 'senha', 'email', 'nome', 'admin'],
      where: { email: loginDto.email },
    });

    const matchPassword = bcrypt.compareSync(loginDto.senha, finded.senha);

    if (!finded || !matchPassword) {
      throw new HttpException(
        EMensagem.UsuarioSenhaInvalido,
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete finded.senha;

    return Object.assign({}, finded) as ILoginPayload;
  }
}
