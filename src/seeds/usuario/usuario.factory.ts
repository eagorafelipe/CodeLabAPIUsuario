import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { define } from 'typeorm-seeding';
import { fakerPT_BR as faker } from '@faker-js/faker';

define(Usuario, () => {
  const usuario = new CreateUsuarioDto();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  usuario.nome = `${firstName} ${lastName}`;
  usuario.email = faker.internet.email({ firstName, lastName }).toLowerCase();
  usuario.senha = faker.internet.password();
  usuario.admin = false;
  usuario.ativo = true;
  return new Usuario(usuario);
});
