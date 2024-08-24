import { IsEmail, IsNotEmpty } from 'class-validator';
import { EMensagem } from 'src/shared/enums/mensagem.enum';

export class LoginDto {
  @IsEmail({}, { message: `email ${EMensagem.NaoValido}` })
  @IsNotEmpty({ message: `email ${EMensagem.NaoPodeSerVazio}` })
  email: string;

  @IsNotEmpty({ message: `senha ${EMensagem.NaoPodeSerVazio}` })
  senha: string;
}
