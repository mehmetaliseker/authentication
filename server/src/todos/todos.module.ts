import { Module } from '@nestjs/common';
import { TodosController } from './controllers/todos.controller';
import { TodosService } from './services/todos.service';
import { TodosRepository } from './repositories/todos.repository';
import { JwtService } from '../auth/services/jwt.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TodosController],
  providers: [TodosService, TodosRepository, JwtService],
  exports: [TodosService],
})
export class TodosModule {}
