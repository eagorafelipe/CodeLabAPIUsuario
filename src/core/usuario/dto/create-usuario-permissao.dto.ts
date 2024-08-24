import { IsInt, IsNotEmpty } from 'class-validator';
import { EMensagem } from 'src/shared/enums/mensagem.enum';

export class CreateUsuarioPermissaoDto {
  @IsNotEmpty({ message: `modulo ${EMensagem.NaoPodeSerVazio}` })
  @IsInt()
  modulo: number;
}
