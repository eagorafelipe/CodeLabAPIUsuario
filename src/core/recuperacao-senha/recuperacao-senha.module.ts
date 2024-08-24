import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecuperacaoSenha } from './entities/recuperacao-senha.entity';
import { RecuperacaoSenhaController } from './recuperacao-senha.controller';
import { RecuperacaoSenhaService } from './recuperacao-senha.service';
import { UsuarioPermissao } from 'src/usuario/entities/usuario-permissao.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { ClientProxy, Closeable } from '@nestjs/microservices';
import { RmqClientService } from 'src/shared/services/rmq-client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecuperacaoSenha, Usuario, UsuarioPermissao]),
  ],
  controllers: [RecuperacaoSenhaController],
  providers: [
    RecuperacaoSenhaService,
    {
      provide: 'EMAIL_SERVICE',
      useFactory: async (
        rmqClientService: RmqClientService,
      ): Promise<ClientProxy & Closeable> => {
        return rmqClientService.createRabbitMQOptions('mail.enviar-email');
      },
      inject: [RmqClientService],
    },
    RmqClientService,
  ],
})
export class RecuperacaoSenhaModule {}
