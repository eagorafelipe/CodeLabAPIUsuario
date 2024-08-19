import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioPermissao } from './entities/usuario-permissao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, UsuarioPermissao])],
  controllers: [UsuarioController],
  providers: [UsuarioService],
})
export class UsuarioModule {}
