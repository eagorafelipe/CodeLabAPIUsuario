import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioPermissao } from 'src/usuario/entities/usuario-permissao.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, UsuarioPermissao])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
