import { DataSource } from 'typeorm';
import { User } from '../auth/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'nestdeneme',
  // build sonrası JS dosyalarını okutacak şekilde path
  entities: [__dirname + '/../auth/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
  schema: 'public',
});
