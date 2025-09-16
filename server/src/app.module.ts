import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule,
    UsersModule,
    TodosModule,
    SearchModule,
  ],
})
export class AppModule {}
