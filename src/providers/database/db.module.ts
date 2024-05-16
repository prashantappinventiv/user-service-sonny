import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { APP_CONFIG } from 'config/configuration';
import { UserDetails } from 'src/entity/user.entity';
console.log(APP_CONFIG, '------------');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: APP_CONFIG.host,
        port: APP_CONFIG.db_port,
        password: APP_CONFIG.password,
        username: APP_CONFIG.userName,
        autoLoadEntities: true,
        entities: [UserDetails],
        database: APP_CONFIG.database,
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(models);
  }
}
