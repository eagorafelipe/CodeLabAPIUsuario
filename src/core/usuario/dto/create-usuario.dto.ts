import { IsArray, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { EMensagem } from 'src/shared/enums/mensagem.enum';
import { CreateUsuarioPermissaoDto } from './create-usuario-permissao.dto';
import { UpdateUsuarioPersmissaoDto } from './update-usuario-permissao.dto';
import { Type } from 'class-transformer';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: `Nome ${EMensagem.NaoPodeSerVazio}` })
  @MaxLength(60, { message: `Nome ${EMensagem.MaisCaracteresQuePermitido}` })
  nome: string;

  @IsNotEmpty({ message: `Email ${EMensagem.NaoPodeSerVazio}` })
  @IsEmail({}, { message: `Email ${EMensagem.NaoValido}` })
  email: string;

  @IsNotEmpty({ message: `Senha ${EMensagem.NaoPodeSerVazio}` })
  senha: string;

  @IsNotEmpty({ message: `Permissão ${EMensagem.NaoPodeSerVazio}` })
  ativo: boolean;

  @IsNotEmpty({ message: `Permissão ${EMensagem.NaoPodeSerVazio}` })
  admin: boolean;

  @IsArray({ message: `Permissão ${EMensagem.TipoInvalido}` })
  @Type(() => CreateUsuarioPermissaoDto)
  permissao: CreateUsuarioPermissaoDto[] | UpdateUsuarioPersmissaoDto[];
}
