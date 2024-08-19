import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { Usuario } from './entities/usuario.entity';
import { HttpResponse } from 'src/shared/classes/http-response';

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

  @Get(':page/:size')
  findAll(@Param('page') page: number, @Param('size') size: number) {
    return this.usuarioService.findAll(page, size);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<IResponse<Usuario>> {
    const usuario = await this.usuarioService.update(+id, updateUsuarioDto);
    return new HttpResponse<Usuario>(usuario).onUpdated();
  }

  @Delete(':id')
  async unactivate(@Param('id') id: string): Promise<IResponse<boolean>> {
    const deleted = await this.usuarioService.unactivate(+id);
    return new HttpResponse<boolean>(deleted).onUnactivated();
  }
}
