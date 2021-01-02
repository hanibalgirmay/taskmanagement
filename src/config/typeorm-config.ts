import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: process.env.PORT || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.TYPRORM_SYNC || dbConfig.synchronize,
};

// @Module({
//     imports: [
//       TypeOrmModule.forRoot({
//         type: 'mysql',
//         host: 'localhost',
//         port: 3306,
//         username: 'postgres',
//         password: 'hanibal',
//         database: 'Development',
//         entities: [__dirname + '/../**/*.entity.ts'],
//         synchronize: true,
//       }),
//     ],
//   })