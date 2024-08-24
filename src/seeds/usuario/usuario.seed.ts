import { Factory, Seeder } from 'typeorm-seeding';
import { Usuario } from '../../core/usuario/entities/usuario.entity';

export class UsuarioSeed implements Seeder {
  async run(factory: Factory): Promise<void> {
    await factory(Usuario)().createMany(10);
  }
}
