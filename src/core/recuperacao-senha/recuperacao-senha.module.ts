import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecuperacaoSenha } from './entities/recuperacao-senha.entity';
import { RecuperacaoSenhaController } from './recuperacao-senha.controller';
import { RecuperacaoSenhaService } from './recuperacao-senha.service';
import { UsuarioPermissao } from 'src/usuario/entities/usuario-permissao.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecuperacaoSenha, Usuario, UsuarioPermissao]),
  ],
  controllers: [RecuperacaoSenhaController],
  providers: [RecuperacaoSenhaService],
})
export class RecuperacaoSenhaModule {}
