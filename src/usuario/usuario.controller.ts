import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { Usuario } from './entities/usuario.entity';
import { HttpResponse } from 'src/shared/classes/http-response';
import { IFindAllFilter } from 'src/shared/interfaces/find-all-filter.interface';
import { IFindAllOrder } from 'src/shared/interfaces/find-all-order.interface';
import { ParseFindAllOrder } from 'src/shared/pipes/parse-find-all-order.pipe';
import { ParseFindAllFilter } from 'src/shared/pipes/parse-find-all-filter.pipe';
import { AlterarSenhaUsuarioDto } from './dto/alterar-senha-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<IResponse<Usuario>> {
    const usuario = await this.usuarioService.create(createUsuarioDto);
    return new HttpResponse<Usuario>(usuario).onCreated();
  }

  @Get(':page/:size/:order')
  async findAll(
    @Param('page') page: number,
    @Param('size') size: number,
    @Param('order', ParseFindAllOrder) order: IFindAllOrder,
    @Query('filter', ParseFindAllFilter)
    filter: IFindAllFilter | IFindAllFilter[],
  ): Promise<IResponse<Usuario[]>> {
    const data = await this.usuarioService.findAll(page, size, order, filter);

    return new HttpResponse<Usuario[]>(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IResponse<Usuario>> {
    const data = await this.usuarioService.findOne(id);

    return new HttpResponse<Usuario>(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<IResponse<Usuario>> {
    const usuario = await this.usuarioService.update(id, updateUsuarioDto);
    return new HttpResponse<Usuario>(usuario).onUpdated();
  }

  @Delete(':id')
  async unactivate(@Param('id') id: number): Promise<IResponse<boolean>> {
    const deleted = await this.usuarioService.unactivate(+id);
    return new HttpResponse<boolean>(deleted).onUnactivated();
  }

  @Put('alterar-senha')
  async alterarSenha(
    @Body() alterarSenhaUsuarioDto: AlterarSenhaUsuarioDto,
  ): Promise<IResponse<boolean>> {
    const data = await this.usuarioService.alterarSenha(alterarSenhaUsuarioDto);
    return new HttpResponse<boolean>(data).onUpdated();
  }
}
